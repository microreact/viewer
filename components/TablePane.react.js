import React from "react";
import PropTypes from "prop-types";
import { createSelector } from "reselect";
import groupBy from "lodash.groupby";
import isEqual from "lodash.isequal";
import { AgGridReact } from "ag-grid-react";

import * as TextUtils from "../utils/text.js";

import TableControls from "../containers/TableControls.react.js";
import { HeaderTextComponent } from "./TableComponents.react.js";

// TODO(james): Figure out how to test this
function DefaultRenderer(props) {
  if (props.column.colDef.urlField) {
    return (
      <a
        href={props.data[props.column.colDef.urlField]}
        target="_blank"
        rel="noreferrer"
      >
        {props.data[props.column.colDef.field]}
      </a>
    );
  }

  return props.valueFormatted;
}

DefaultRenderer.propTypes = {
  column: PropTypes.shape({
    colDef: PropTypes.shape({
      urlField: PropTypes.string,
      field: PropTypes.string,
    }),
  }),
  data: PropTypes.any, // Row data
  value: PropTypes.any, // Field value
  valueFormatted: PropTypes.any, // Field value
};

const valueFormatter = (args) => {
  return TextUtils.toText(
    args.column.colDef.dataType,
    args.data[args.column.colDef.field],
    false /* convertBlanks */,
  );
};

const defaultRenderersDictionary = {
  DefaultRenderer,
  agColumnHeader: HeaderTextComponent,
};

class TablePane extends React.Component {
  tableRef = React.createRef();

  defaultColDef = {
    editable: false,
    sortable: false,
    filter: false,
    resizable: false,
  };

  dataColumnsSelector = createSelector(
    (props) => props.columns,
    (props) => props.fieldsMap,
    (props) => props.dataColumns,
    (
      columns,
      fieldsMap,
      dataColumns,
    ) => {
      const tableColumns = [];

      const fields = new Set();

      for (const col of columns) {
        const dataColumn = fieldsMap.get(col.field);
        if (dataColumn) {
          fields.add(col.field);
          tableColumns.push({
            cellRenderer: col.renderer || "DefaultRenderer",
            controls: col.controls ?? true,
            dataColumn,
            dataKey: col.field,
            dataType: dataColumn.dataType,
            field: dataColumn.name,
            group: dataColumn.group,
            headerName: col.label || dataColumn.label || dataColumn.name,
            hide: col.hidden || false,
            hidden: col.hidden || false, // Used by TableHeaderMenuContent
            key: `data-${col.field}`,
            minWidth: col.minWidth || 20, // TODO: Revert
            frozen: false, // TODO: Revert
            pinned: col.pinned,
            sort: col.sort,
            sortable: true,
            resizable: true,
            tableId: this.props.tableId,
            title: col.label || dataColumn.label || dataColumn.name,
            valueFormatter,
            width: col.width,
          });
        }
      }

      // QUESTION(james): Why do we have the data nested in this way? Seems like duplication and extra complexity.
      for (const dataColumn of dataColumns) {
        if (!fields.has(dataColumn.name)) {
          tableColumns.push({
            cellRenderer: dataColumn.cellRenderer || "DefaultRenderer",
            controls: true,
            dataColumn,
            dataKey: dataColumn.name,
            dataType: dataColumn.dataType,
            field: dataColumn.name,
            group: dataColumn.group,
            headerName: dataColumn.label || dataColumn.name,
            hide: false,
            hidden: false,
            pinned: dataColumn.pinned,
            key: `data-${dataColumn.name}`,
            minWidth: dataColumn.minWidth,
            tableId: this.props.tableId,
            sortable: true,
            resizable: true,
            title: dataColumn.label || dataColumn.name,
            valueFormatter,
            width: dataColumn.width,
          });
        }
      }

      // WHY: Adds a checkbox column that can be used for selected/selecting columns
      const firstColumnCheckboxProps = {
        checkboxSelection: this.props.hasSelectionColumn,
        headerCheckboxSelection: this.props.hasSelectionColumn,
      };

      const columnsWithCheckbox = tableColumns.map((column, index) => (index ? column : {
        ...column,
        ...firstColumnCheckboxProps,
      }));

      const hasVisibleGroups = columnsWithCheckbox.some((item) => !item.hide && !!item.group);

      // WHY: If we're not showing any groups, we don't need to configure ag-grid to display them
      // It also stops the column headers appearing taller than necessary
      if (!hasVisibleGroups) {
        return columnsWithCheckbox;
      }

      return this.getGroupedColumns(columnsWithCheckbox);
    },
  );

  componentDidUpdate(prevProps) {
    if (prevProps.selectedIds !== this.props.selectedIds) {
      if (this.props.selectedIds?.length) {
        this.scrollToFirstSelected();
      }
      this.setSelectedRows();
    }
  }

  scrollToFirstSelected() {
    const rowIndex = this.props.dataTable.findIndex((x) => x[0] === this.props.selectedIds[0]);
    this.tableRef.current.api.ensureIndexVisible(rowIndex);
  }

  /**
   * Groups columns, sorts the headings alpabetically and disables moving
   * @param {*} columns
   * @returns
   */
  getGroupedColumns = (columns) => {
    const grouped = groupBy(columns, (item) => item.dataColumn.group || "ungrouped");
    const columnDefs = Object
      .entries(grouped)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .reduce((all, [groupName, children]) => {
        if (groupName === "ungrouped") {
          return [
            ...all,
            ...children,
          ];
        }
        return [
          ...all,
          {
            headerName: groupName,
            children: children
              .sort((a, b) => (a.headerName > b.headerName ? 1 : -1))
              .map((child) => ({ ...child, suppressMovable: true })),
          },
        ];
      }, []);

    console.log({ columnDefs });
    return columnDefs;
  }

  /**
   * Updates all rows with a selection state
   *
   * As we persist the selected rows in a parent/redux, we need to set the selected rows when a table is mounted
   *
   * Also, ag-grid doesn't provide a data-driven way to do this so needs to be done via methods
   *
   * @see https://www.ag-grid.com/react-data-grid/row-selection/#example-using-foreachnode
   */
  setSelectedRows() {
    const selected = [];
    const deselected = [];
    this.tableRef.current.api.forEachNode((node) => {
      const isInSelectedList = this.props.selectedIds.includes(node.data[0]);
      const list = isInSelectedList ? selected : deselected;
      list.push(node);
    });

    this.tableRef.current.api.setNodesSelected({
      nodes: selected,
      newValue: true,
    });
    this.tableRef.current.api.setNodesSelected({
      nodes: deselected,
      newValue: false,
    });

  }

  getSelectedNodeIds() {
    const selectedNodes = this.tableRef.current.api.getSelectedNodes();
    const selectedIds = selectedNodes.map((node) => node.data[0]);
    return selectedIds;
  }

  onRowSelected = (evt) => {
    const ids = this.getSelectedNodeIds();
    if (!isEqual(ids, this.props.selectedIds) && evt.source !== "api") {
      this.props.onSelectRows(ids);
    }
  };

  onGridReady = () => {
    this.setSelectedRows();
  };

  // NOTE(james): This is how autosizing is meant to work but,
  // it's causing a flash each time we swap tables
  // onFirstDataRendered = () => {
  //   this.tableRef.current.columnApi.autoSizeAllColumns();
  // }

  onRowDataUpdated = () => {
    this.setSelectedRows();
  };

  onColumnResized = (evt) => {
    if (evt.finished && evt.source !== "autosizeColumns") {
      this.props.onColumnResize(evt.column.colId, evt.column.actualWidth);
    }
  };

  onColumnMoved = (evt) => {
    if (evt.finished && evt.source === "uiColumnMoved") {
      const [column] = evt.columns;
      this.props.onColumnMove(column.colId, evt.toIndex);
    }
  };

  render() {
    const { props } = this;

    const columnDefs = this.dataColumnsSelector(this.props);
    const rowData = props.dataTable;

    return (
      <div style={{ width: "100%", height: "100%" }} className="mr-table">
        <TableControls
          tableId={props.tableId}
        />
        <AgGridReact
          className={`ag-theme-alpine ${props.displayMode}`}
          columnDefs={columnDefs}
          components={{
            ...defaultRenderersDictionary,
            ...props.componentsDictionary || {}, // Passed via json
          }}

          defaultColDef={this.defaultColDef}
          onGridReady={this.onGridReady}
          onRowDataUpdated={this.onRowDataUpdated}
          onRowSelected={this.onRowSelected}
          onColumnResized={this.onColumnResized}
          onColumnMoved={this.onColumnMoved}
          ref={this.tableRef}
          rowData={rowData}
          rowMultiSelectWithClick={false}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          suppressMovableColumns={false}
          suppressDragLeaveHidesColumns={true}
          // WHY: For backwards compatibility with Microreact JSON passed to previous table library.
          // There may be keys with dots in that would break if this was enabled
          suppressFieldDotNotation={true}
        />
      </div>
    );
  }

}

TablePane.displayName = "TablePane";

TablePane.propTypes = {
  columns: PropTypes.array.isRequired,
  componentsDictionary: PropTypes.object,
  dataColumns: PropTypes.array.isRequired,
  dataTable: PropTypes.array.isRequired,
  displayMode: PropTypes.oneOf([
    "cosy",
    "comfortable",
    "compact",
  ]).isRequired,
  fieldsMap: PropTypes.object.isRequired,
  hasSelectionColumn: PropTypes.bool,
  onColumnMove: PropTypes.func.isRequired,
  onColumnResize: PropTypes.func.isRequired,
  onSelectRows: PropTypes.func.isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.number),
  tableId: PropTypes.string.isRequired,
};

TablePane.defaultProps = {
  hasSelectionColumn: true,
};

export default TablePane;
