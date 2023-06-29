import React from "react";
import PropTypes from "prop-types";
import { createSelector } from "reselect";
import groupBy from "lodash.groupby";
import isEqual from "lodash.isequal";
import { AgGridReact } from "ag-grid-react";

import * as TextUtils from "../utils/text";

import TableControls from "../containers/TableControls.react";

const dataGetter = (args) => {
  if (args.column.dataColumn.urlField) {
    return (
      <a
        href={args.rowData[args.column.dataColumn.urlField]}
        target="_blank"
        rel="noreferrer"
      >
        {args.rowData[args.column.field]}
      </a>
    );
  }

  return TextUtils.toText(
    args.column.dataType,
    args.rowData[args.column.field],
    false /* convertBlanks */,
  );
};

class TablePane extends React.Component {
  tableRef = React.createRef()

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
            controls: col.controls ?? true,
            dataColumn,
            dataKey: col.field,
            dataType: dataColumn.dataType,
            field: dataColumn.name,
            frozen: col.fixed,
            group: dataColumn.group,
            hidden: col.hidden || false,
            key: `data-${col.field}`,
            minWidth: col.minWidth || 40,
            renderer: col.renderer,
            resizable: true,
            sort: col.sort,
            sortable: true,
            selected: true,

            tableId: this.props.tableId,
            title: col.label || dataColumn.label || dataColumn.name,
            width: col.width || "auto",

            dataGetter,
          });
        }
      }

      // QUESTION(james): Why do we have the data nested in this way? Seems like duplication and extra complexity.
      for (const dataColumn of dataColumns) {
        if (!fields.has(dataColumn.name)) {
          tableColumns.push({
            controls: true,
            dataColumn,
            dataKey: dataColumn.name,
            dataType: dataColumn.dataType,
            field: dataColumn.name,
            group: dataColumn.group,
            hidden: false,
            key: `data-${dataColumn.name}`,
            minWidth: dataColumn.minWidth || 40,
            resizable: true,
            sortable: true,
            selected: true,
            tableId: this.props.tableId,
            title: dataColumn.label || dataColumn.name,
            width: dataColumn.width || "auto",
            dataGetter,
          });
        }
      }

      return tableColumns;
    },
  );

  /**
  * Creates columnDefs in the shape required by ag-grid-react
  *
  * We could do it within the selector dataColumnsSelector,
  * but we need to pass that shape back to renderer components for backwards compatibility
  *
  * @returns {Array}
  */
  getColumnDefs() {
    const selectedColumns = this.dataColumnsSelector(this.props);

    const mappedColumns = selectedColumns
      .map(({ hidden, ...item }) => ({
        ...item,
        hide: hidden,
        headerName: item.title,
        field: item.field,
        cellRenderer: item.renderer,
        // WHY(james): Need to modify the props any cellRenderer components receive for backwards compatibility
        cellRendererParams: (params) => {
          return {
            ...params,
            cellData: params.value,
            // NOTE(james):  This collides with param.column passed by ag-grid, so mapped to another key (columnProps), providing an upgrade path
            column: params.column.userProvidedColDef,
            columnProps: params.column,
            columns: selectedColumns,
            rowData: params.data,
          };
        },
      }))
      .filter((item) => !item.hide); // WHY: Stops tables without groups having a tall heading

    // WHY: Adds a checkbox column that can be used for selected/selecting columns
    // const selectionColumn = this.props.hasSelectionColumn && [{
    const selectionColumn = true && [{
      field: "",
      width: 40,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    }];

    // TODO(james): This is a bit of a clunky way to handle this, needs revisting
    const grouped = groupBy(mappedColumns, (item) => item.dataColumn.group || "ungrouped");
    const columnDefs = Object.entries(grouped).reduce((all, [groupName, children], index) => {
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
          children,
        },
      ];
    }, selectionColumn || []);

    return columnDefs;
  }

  componentDidUpdate(prevProps) {
    const { props } = this;
    if (
      prevProps.selectedIds !== props.selectedIds
      && props.selectedIds
      && props.selectedIds.length
    ) {
      this.scrollToFirstSelected();
    }
  }

  scrollToFirstSelected() {
    const rowIndex = this.props.dataTable.findIndex((x) => x[0] === this.props.selectedIds[0]);
    this.tableRef.current.api.ensureIndexVisible(rowIndex);
  }

  /**
   * Updates all rows with a selection state
   *
   * As we persist the selected rows in a parent/redux, we need to set the selected rows when a table is mounted
   *
   * Also, ag-grid doesn't provide a data-driven way to do this so need to be done via methods
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

  onRowSelected = () => {
    const ids = this.getSelectedNodeIds();
    if (!isEqual(ids, this.props.selectedIds)) {
      this.props.onSelectRows(ids);
    }
  }

  onGridReady = () => {
    this.setSelectedRows();
  }

  onRowDataUpdated = () => {
    this.setSelectedRows();
  }

  render() {
    const { props } = this;

    const defaultColDef = {
      editable: false,
      sortable: true,
      filter: true,
      resizable: true,
    };

    const columnDefs = this.getColumnDefs();
    const rowData = props.dataTable;

    return (
      <div style={{ width: "100%", height: "100%" }}>
        <TableControls
          tableId={props.tableId}
        />
        <AgGridReact
          className={`ag-theme-alpine ${props.displayMode}`}
          columnDefs={columnDefs}
          components={props.componentsDictionary}
          defaultColDef={defaultColDef}
          onGridReady={this.onGridReady}
          onRowDataUpdated={this.onRowDataUpdated}
          onRowSelected={this.onRowSelected}
          ref={this.tableRef}
          rowData={rowData}
          rowMultiSelectWithClick={false}
          rowSelection="multiple"
          suppressRowClickSelection={true}
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
  fieldsMap: PropTypes.array.isRequired,
  hasSelectionColumn: PropTypes.bool,
  onSelectRows: PropTypes.func.isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.number),
  tableId: PropTypes.string.isRequired,
  // height: PropTypes.number.isRequired,
  // width: PropTypes.number.isRequired,
};

TablePane.defaultProps = {
  hasSelectionColumn: true,
};

export default TablePane;
