/* eslint "react/prop-types": 0 */

import React from "react";
import PropTypes from "prop-types";
import { createSelector } from "reselect";
import BaseTable from "react-base-table/lib";

// import "../styles/table.css";
import { nextTick } from "../utils/browser";
import * as TextUtils from "../utils/text";
import tableComponents, { HeaderCellComponent, SortableContainer } from "./TableComponents.react";

import TableControls from "../containers/TableControls.react";

const dataGetter = (args) => {
  if (args.column.dataColumn.urlField) {
    return (
      <a
        href={args.rowData[args.column.dataColumn.urlField]}
        target="_blank"
        rel="noreferrer"
      >
        { args.rowData[args.column.field] }
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
            minWidth: 40,
            resizable: true,
            sort: col.sort,
            group: dataColumn.group,
            sortable: true,
            tableId: this.props.tableId,
            title: col.label || dataColumn.label || dataColumn.name,
            width: col.width || 100,
            dataGetter,
          });
        }
      }

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
            minWidth: 40,
            resizable: true,
            group: dataColumn.group,
            sortable: true,
            tableId: this.props.tableId,
            title: dataColumn.label || dataColumn.name,
            width: 100,
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
    // if (columns?.length === 1 && columns?.[0]?.frozen) {
    //   return null;
    // }

    // if (headerIndex === 0) {
    //   if (columns?.length === 1) {
    //     return null;
    //   }

    //   // return (
    //   //   columns.map(
    //   //     (x) => (
    //   //       <div
    //   //         role="gridcell"
    //   //         className="BaseTable__header-cell"
    //   //         key={x.dataKey}
    //   //         style={
    //   //           { width: x.width }
    //   //         }
    //   //       >
    //   //         <div
    //   //           className="BaseTable__header-cell-text">
    //   //             { x.group || null }
    //   //         </div>
    //   //       </div>
    //   //     )
    //   //   )
    //   // );

    //   const groupCells = [];
    //   groupCells.push(
    //     <div
    //       role="gridcell"
    //       className="BaseTable__header-cell"
    //       key={columns[0].dataKey}
    //       style={
    //         { width: columns[0].width }
    //       }
    //     >
    //       <div className="BaseTable__header-cell-text" />
    //     </div>
    //   );
    //   let previousColumn = columns[1];
    //   let width = 0;
    //   for (let index = 1; index < columns.length; index++) {
    //     const column = columns[index];
    //     if (column.group !== previousColumn.group) {
    //       groupCells.push(
    //         <div
    //           role="gridcell"
    //           className="BaseTable__header-cell mr-group-cell"
    //           key={previousColumn.dataKey}
    //           style={
    //             { width }
    //           }
    //         >
    //           <div
    //             className="BaseTable__header-cell-text">
    //               { previousColumn.group || null }
    //           </div>
    //         </div>
    //       );
    //       width = 0;
    //     }
    //     width += column.width;
    //     previousColumn = column;
    //   }
    //   return groupCells;
    // }

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
        { cells }
      </SortableContainer>
    );
  }

  render() {
    const { props } = this;

    const columns = this.tableColumnsSelector(props);

    return (
      <div
        className="mr-table"
        style={
          {
            height: props.height,
            width: props.width,
          }
        }
      >
        <TableControls
          tableId={props.tableId}
        />

        <BaseTable
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
          componentsLookup={props.componentsLookup}
        />
      </div>
    );
  }

}

TablePane.displayName = "TablePane";

TablePane.propTypes = {
  columns: PropTypes.array.isRequired,
  componentsLookup: PropTypes.object,
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
