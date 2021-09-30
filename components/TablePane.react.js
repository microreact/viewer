/* eslint "react/prop-types": 0 */

import React from "react";
import PropTypes from "prop-types";
import { createSelector } from "reselect";
import BaseTable from "react-base-table/lib";

import "../css/table.css";
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

  dataColumnsSelector = createSelector(
    (props) => props.columns,
    (props) => props.fieldsMap,
    (
      columns,
      fieldsMap,
    ) => {
      const tableColumns = [];

      for (const col of columns) {
        const dataColumn = fieldsMap.get(col.field);
        if (dataColumn) {
          tableColumns.push({
            dataColumn,
            dataKey: col.field,
            dataType: dataColumn.dataType,
            field: dataColumn.name,
            frozen: col.fixed,
            hidden: col.hidden || false,
            key: `data-${col.field}`,
            minWidth: 40,
            resizable: true,
            sort: col.sort,
            sortable: true,
            tableId: this.props.tableId,
            title: col.label || dataColumn.label || dataColumn.name,
            width: col.width || 100,
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
    (
      dataColumns,
      selectedIds,
    ) => {
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
        />
      </div>
    );
  }

}

TablePane.displayName = "TablePane";

TablePane.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  displayMode: PropTypes.string.isRequired,
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
};

export default TablePane;
