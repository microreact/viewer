/* eslint "react/prop-types": 0 */

import React from "react";
import PropTypes from "prop-types";
import { createSelector } from "reselect";
import BaseTable from "react-base-table/lib";

// import "../styles/table.css";
import { AgGridReact } from "ag-grid-react";
import groupBy from "lodash.groupby";
import { nextTick } from "../utils/browser";
import * as TextUtils from "../utils/text";
import TableControls from "../containers/TableControls.react";
import tableComponents, { HeaderCellComponent, SortableContainer } from "./TableComponents.react";

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
  // const value = args.rowData[args.column.field];
  // if (args.column.dataType === "date") {
  //   return timestampToDateString(value);
  // }
  // if (args.column.dataType === "boolean") {
  //   return (value === true) ? "✅" : (value === false) ? "❌" : null;
  // }
  // else {
  //   return value;
  // }
};

const displayModeToRowHeight = {
  comfortable: 40,
  cosy: 32,
  compact: 24,
};

class TablePane extends React.PureComponent {

  state = {
    columnIndex: null,
    rowIndex: null,
    scrollToRow: 0,
  }

  tableRef = React.createRef()

  // TODO: merge these two selectors
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
            dataColumn,
            dataKey: col.field,
            dataType: dataColumn.dataType,
            field: dataColumn.name,
            frozen: col.fixed,
            controls: col.controls ?? true,
            renderer: col.renderer,
            hidden: col.hidden || false,
            key: `data-${col.field}`,
            minWidth: col.minWidth || 40,
            resizable: true,
            sort: col.sort,
            group: dataColumn.group,
            sortable: true,
            tableId: this.props.tableId,
            title: col.label || dataColumn.label || dataColumn.name,
            width: col.width || "auto",
            dataGetter,
          });
        }
      }

      // QUESTION(james): Why do we have
      for (const dataColumn of dataColumns) {
        if (!fields.has(dataColumn.name)) {
          tableColumns.push({
            controls: true,
            dataColumn,
            dataKey: dataColumn.name,
            dataType: dataColumn.dataType,
            field: dataColumn.name,
            hidden: false,
            key: `data-${dataColumn.name}`,
            minWidth: dataColumn.minWidth || 40,
            resizable: true,
            group: dataColumn.group,
            sortable: true,
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

  tableColumnsSelector = createSelector(
    this.dataColumnsSelector,
    (props) => props.selectedIds,
    (props) => props.hasSelectionColumn,
    (
      dataColumns,
      selectedIds,
      hasSelectionColumn,
    ) => {
      if (!hasSelectionColumn) {
        return dataColumns;
      }
      else {
        return [
          {
            key: "--microreact-selection-cell",
            dataKey: "--microreact-selection-cell",
            field: "--microreact-selection-cell",
            title: "--microreact-selection-cell",
            width: 40,
            tableId: this.props.tableId,
            hidden: false,
            minWidth: 40,
            resizable: false,
            selectedIds,
            frozen: true,
          },
          ...dataColumns,
        ];
      }
    },
  );

  componentDidUpdate(prevProps) {
    const { props } = this;
    if (prevProps.selectedIds !== props.selectedIds && props.selectedIds && props.selectedIds.length) {
      const rowIndex = props.data[0].findIndex((x) => x[0] === props.selectedIds[0]);
      this.tableRef.current.scrollToRow(rowIndex);
    }
  }

  renderTableHeaderRow = ({ cells, columns }) => {
    return (
      <SortableContainer
        axis="x"
        useDragHandle
        onSortEnd={
          (args) => {
            this.props.onColumnMove(args.oldIndex - 1, Math.max(args.newIndex - 1, 0));
          }
        }
        helperContainer={
          () => this.tableRef.current.tableNode
        }
      >
        {cells}
      </SortableContainer>
    );
  }

  getColumnDefs() {
    const selectedColumns = this.tableColumnsSelector(this.props);

    const mappedColumns = selectedColumns
      .map(({ hidden, ...item }) => {
        return {
          ...item,
          hide: hidden,
          headerName: item.title,
          field: item.field,
          cellRenderer: item.renderer,
          // WHY(james): Need to modify the props the any cellRenderer components receive for backwards compatibility
          cellRendererParams: (params) => {
            return {
              ...params,
              cellData: params.value,
              // NOTE(james):  This collides with param.column passed by ag-grid, so mapped to another key (columnProps) providing an upgrade path
              column: params.column.userProvidedColDef,
              columnProps: params.column,
              columns: selectedColumns,
              rowData: params.data,
            };
          },
        };
      })
      .filter((item) => !item.hide); // WHY: Stops tables without groups having a tall heading

    const grouped = groupBy(mappedColumns, (item) => item.dataColumn.group || "ungrouped");

    const columnDefs = Object.entries(grouped).reduce((all, [groupName, children]) => {
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
    }, []);

    return columnDefs;
  }

  render() {
    const { props } = this;

    const columnDefs = this.getColumnDefs();
    const rowData = props.data[0]; // QUESTION(james): Why do we only use a single dataset?
    const rowHeight = displayModeToRowHeight[props.displayMode]; // FIXME(james): Not changing the height

    console.log({ rowData, columnDefs, rowHeight });

    const gridOptions = {
      getRowClass: (params) => "full-width-row",
    };

    return (
      <div
        className="mr-table"
        style={{
          height: props.height,
          // width: "100%",
        }}
      >
        <TableControls
          tableId={props.tableId}
        />

        <AgGridReact
          style={{
            height: props.height,
            minWidth: "100%",
          }}
          className="ag-theme-alpine"
          columnDefs={columnDefs}
          components={props.componentsDictionary}
          gridOptions={gridOptions}
          rowData={rowData}
          rowHeight={rowHeight}
          suppressFieldDotNotation={true} // WHY: For backwards compatibility with previous table lib and Microreact JSON
        />
        {/* <BaseTable
          columns={columns}
          components={tableComponents}
          data={props.data[0]}
          fixed
          headerCellProps={
            (args) => {
              return {
                index: args.columnIndex,
                tagName: HeaderCellComponent,
              };
            }
          }
          headerHeight={40}
          // headerHeight={[ 32, 40 ]}
          headerRenderer={this.renderTableHeaderRow}
          height={props.height - 24}
          onColumnExpand={
            (column) => {
              props.onColumnExpand(column.field);
            }
          }
          onColumnResizeEnd={
            (args) => {
              nextTick(() =>
                props.onColumnResize(
                  args.column.field,
                  args.width
                )
              );
            }
          }
          // onColumnSort={
          //   (args) => {
          //     props.onColumnSort(
          //       args.column.field,
          //       (args.order === "asc" && props.sort[args.column.field] === "desc") ? undefined : args.order
          //     );
          //   }
          // }
          onSelectRows={props.onSelectRows}
          ref={this.tableRef}
          rowHeight={displayModeToRowHeight[props.displayMode]}
          rowKey={0}
          sortState={props.sort}
          width={props.width}
          componentsDictionary={props.componentsDictionary}
        /> */}
      </div>
    );
  }

}

TablePane.displayName = "TablePane";

TablePane.propTypes = {
  columns: PropTypes.array.isRequired,
  componentsDictionary: PropTypes.object,
  data: PropTypes.array.isRequired,
  displayMode: PropTypes.string.isRequired,
  hasSelectionColumn: PropTypes.bool,
  height: PropTypes.number.isRequired,
  onColumnExpand: PropTypes.func.isRequired,
  onColumnMove: PropTypes.func.isRequired,
  onColumnResize: PropTypes.func.isRequired,
  onColumnSort: PropTypes.func.isRequired,
  onSelectRows: PropTypes.func.isRequired,
  rowKey: PropTypes.number,
  sort: PropTypes.object.isRequired,
  tourStep: PropTypes.string,
  width: PropTypes.number.isRequired,
};

TablePane.defaultProps = {
  rowKey: 0,
  hasSelectionColumn: true,
};

export default TablePane;
