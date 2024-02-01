/* eslint "react/prop-types": 0 */
import Button from "@mui/material/Button";
import React from "react";
import PropTypes from "prop-types";
import { createSelector } from "reselect";

import * as TextUtils from "../utils/text";

import TableHeaderMenu from "../containers/TableColumnMenu.react";
import TableControls from "../containers/TableControls.react";
import UiDataTable from "./ui-data-table/index.js";

import styles from "./TablePane.module.css";

function renderHeader(
  _,
  columnDef,
) {
  return (
    <React.Fragment>
      {
        columnDef.hasControls && (
          <TableHeaderMenu
            dataColumn={columnDef.dataColumn}
            title={columnDef.label}
            tableId={columnDef.tableId}
          />
        )
      }

      <Button
        className={styles["mr-table-header-cell-label"]}
        onClick={() => _.getContext().table.options.meta.onColourByFieldChange(columnDef.id)}
        title={`Set colour by column to ${columnDef.label}`}
        variant="text"
      >
        {columnDef.label}
      </Button>

    </React.Fragment>
  );
}

class TablePane extends React.PureComponent {

  // columnOrderSelector = createSelector(
  //   (props) => props.columns,
  //   (props) => props.fieldsMap,
  //   (
  //     columns,
  //     fieldsMap,
  //   ) => {
  //     const order = [];

  //     for (const col of columns) {
  //       const dataColumn = fieldsMap.get(col.field);
  //       if (dataColumn) {
  //         order.push(col.field);
  //       }
  //     }

  //     return order;
  //   },
  // );

  // tableColumnsSelector = createSelector(
  //   (props) => props.columns,
  //   (props) => props.dataColumns,
  //   (
  //     tableColumns,
  //     dataColumns,
  //   ) => {
  //     const columns = [];

  //     const tableColumnsByField = createLookupMap(tableColumns, "field");

  //     for (const dataColumn of dataColumns) {
  //       const tableColumn = tableColumnsByField.get(dataColumn.name);
  //       columns.push({
  //         id: dataColumn.name,
  //         group: dataColumn.group,
  //         width: tableColumn?.width || 120,
  //         label: tableColumn?.label || dataColumn.label || dataColumn.name,
  //         tableId: this.props.tableId,
  //         dataColumn,
  //         resizable: tableColumn?.resizable ?? true,
  //         sortable: tableColumn?.sortable ?? true,
  //         dragable: tableColumn?.dragable ?? true,
  //       });
  //     }

  //     return columns;
  //   },
  // );

  tableColumnsSelector = createSelector(
    (props) => props.columns,
    (props) => props.dataColumnsByFieldMap,
    (
      tableColumns,
      dataColumnsByFieldMap,
    ) => {
      const columns = [];

      for (const tableColumn of tableColumns) {
        const dataColumn = dataColumnsByFieldMap.get(tableColumn.field);
        if (dataColumn && !tableColumn.hidden) {
          columns.push({
            dataColumn,
            renderer: tableColumn.renderer,
            dragable: tableColumn.dragable ?? true,
            group: dataColumn.group,
            hasControls: tableColumn.hasControls ?? true,
            id: dataColumn.name,
            label: tableColumn.label || dataColumn.label || dataColumn.name,
            resizable: tableColumn.resizable ?? true,
            sortable: tableColumn.sortable ?? true,
            fixed: tableColumn.fixed ?? tableColumn.pinned ?? false,
            tableId: this.props.tableId,
            width: tableColumn.width || 120,
          });
        }
      }

      return columns;
    },
  );

  renderCell = (
    _,
    columnDef,
    row,
  ) => {
    const { props } = this;

    const formattedValue = TextUtils.toText(
      columnDef.dataColumn.dataType,
      row[columnDef.id],
      false /* convertBlanks */,
    );

    if (columnDef.renderer) {
      const Component = props.componentsDictionary[columnDef.renderer];
      return (
        <Component
          column={columnDef}
          data={row}
          value={formattedValue}
        />
      );
    }

    if (columnDef?.dataColumn?.urlField) {
      return (
        <a
          href={row[columnDef.dataColumn.urlField]}
          target="_blank"
          rel="noreferrer"
        >
          { formattedValue }
        </a>
      );
    }

    return formattedValue;

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
  }

  // tableColumnsSelector = createSelector(
  //   this.dataColumnsSelector,
  //   (props) => props.selectedIds,
  //   (props) => props.hasSelectionColumn,
  //   (
  //     dataColumns,
  //     selectedIds,
  //     hasSelectionColumn,
  //   ) => {
  //     if (!hasSelectionColumn) {
  //       return dataColumns;
  //     }
  //     else {
  //       return [
  //         // {
  //         //   key: "--microreact-selection-cell",
  //         //   dataKey: "--microreact-selection-cell",
  //         //   field: "--microreact-selection-cell",
  //         //   title: "--microreact-selection-cell",
  //         //   width: 40,
  //         //   tableId: this.props.tableId,
  //         //   hidden: false,
  //         //   minWidth: 40,
  //         //   resizable: false,
  //         //   selectedIds,
  //         //   frozen: true,
  //         // },
  //         ...dataColumns,
  //       ];
  //     }
  //   },
  // );

  render() {
    const { props } = this;

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

        <UiDataTable
          borders="horizontal"
          columns={this.tableColumnsSelector(props)}
          data={props.data[0]}
          displayMode={props.displayMode}
          height={props.height - 12}
          cellRenderer={this.renderCell}
          headerRenderer={renderHeader}
          width={props.width}
          onColumnsResize={props.onColumnsResize}
          rowId="0"
          selectedRowIds={props.selectedIds}
          selectableRows
          onColumnOrderChange={props.onColumnOrderChange}
          onColumnExpand={props.onColumnExpand}
          onSelectedRowIdsChange={props.onSelectRows}
          meta={{ onColourByFieldChange: props.onColourByFieldChange }}
          // groupableColumns={false}
          // onColumnSort={
          //   (args) => {
          //     props.onColumnSort(
          //       args.column.field,
          //       (args.order === "asc" && props.sort[args.column.field] === "desc") ? undefined : args.order
          //     );
          //   }
          // }
          // onSelectRows={props.onSelectRows}
          sortState={props.sort}
          componentsDictionary={props.componentsDictionary}
        />
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
  onColumnOrderChange: PropTypes.func.isRequired,
  onColumnSort: PropTypes.func.isRequired,
  onColumnsResize: PropTypes.func.isRequired,
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
