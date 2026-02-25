import React from "react";
import PropTypes from "prop-types";
import cc from "classcat";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer, notUndefined } from "@tanstack/react-virtual";

import CustomDragLayer from "./drag-layer.js";
import ColumnHeader from "./column-header.js";
import IndeterminateCheckbox from "./indeterminate-checkbox.js";

import styles from "./data-table.module.css";

const displayModeToRowHeight = {
  comfortable: 52,
  cosy: 40,
  compact: 32,
};

function findResizingHeader(table) {
  for (const headerGroup of table.getHeaderGroups()) {
    for (const header of headerGroup.headers) {
      if (header.column.getIsResizing()) {
        return header;
      }
    }
  }

  return undefined;
}

function getColumnStyle(type, column) {
  const style = {
    "minWidth": column.getSize(),
    "maxWidth": column.getSize(),
  };
  const pinnedLocation = column.getIsPinned(); // left, right (when pinned), otherwise null
  if (pinnedLocation) {
    style["position"] = "sticky";
    style[pinnedLocation] = column.getStart();
    if (type === "header") {
      style["zIndex"] = "2";
    }
    if (type === "cell") {
      style["zIndex"] = "0";
    }
  }
  return style;
}

function UiDataTable(props) {
  const [columns, columnSizingState, columnPinningState, columnOrderState] = React.useMemo(
    () => {
      const cols = [];
      const columnSizing = {};
      const columnPinning = { "left": [], "right": [] };
      const unpinnedColumns = [];
      const indexByGroupName = {};
      if (props.selectableRows) {
        const id = "--ui-data-table-selection";
        columnSizing[id] = 32;
        columnPinning["left"].push(id);
        cols.push(
          {
            id,
            resizable: false,
            dragable: false,
            renderable: false,
            header: ({ table }) => (
              <IndeterminateCheckbox
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
              />
            ),
            cell: ({ row }) => {
              return (
                <IndeterminateCheckbox
                  checked={row.getIsSelected()}
                  disabled={!row.getCanSelect()}
                  indeterminate={row.getIsSomeSelected()}
                  onChange={row.getToggleSelectedHandler()}
                />
              );
            },
            className: styles["selection-column"],
          }
        );
      }
      for (const col of props.columns) {
        const tableColumn = {
          ...col,
          "id": col.id,
          "accessorKey": col.id,
          // "header": col.label || col.id,
          "enableDragging": col.fixed ? false : (col.dragable ?? props.dragableColumns),
          "enableResizing": col.resizable ?? props.resizableColumns,
          "enableColumnPinning": col.pinnable ?? props.pinnableColumns,
          // "renderable": col.renderable ?? true,
          // cell: (info) => info.getValue(),
          // header: () => <span>Last Name</span>,
        };

        columnSizing[col.id] = col.width || props.minColumnWidth;
        if (col.fixed === "right") {
          columnPinning["right"].push(col.id);
        }
        else if (col.fixed === "left" || col.fixed === true) {
          columnPinning["left"].push(col.id);
        }
        else {
          unpinnedColumns.push(col.id);
        }

        if (props.groupableColumns && col.group) {
          if (!(col.group in indexByGroupName)) {
            cols.push({
              "renderable": false,
              "header": col.group,
              "columns": [],
            });
            indexByGroupName[col.group] = cols.length - 1;
          }
          cols[indexByGroupName[col.group]].columns.push(tableColumn);
        }
        else {
          cols.push(tableColumn);
        }
      }

      const columnOrder = [
        ...columnPinning.left,
        ...unpinnedColumns,
        ...columnPinning.right,
      ];

      return [
        cols,
        columnSizing,
        columnPinning,
        columnOrder,
      ];
    },
    [props.columns, props.dragableColumns, props.groupableColumns, props.minColumnWidth, props.pinnableColumns, props.resizableColumns, props.selectableRows],
  );

  const rowSelection = React.useMemo(
    () => {
      const selection = {};
      for (const rowId of props.selectedRowIds) {
        selection[rowId] = true;
      }
      return selection;
    },
    [props.selectedRowIds],
  );

  const style = React.useMemo(
    () => {
      return {
        "height": props.height,
        "width": props.width,
      };
    },
    [props.height, props.width],
  );

  const table = useReactTable({
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: true,
    meta: {
      headerClickMode: props.headerClickMode ?? "colour",
    },
    state: {
      columnOrder: columnOrderState,
      columnPinning: columnPinningState,
      columnSizing: columnSizingState,
      rowSelection,
    },
    columnResizeMode: "onEnd",
    columns,
    data: props.data,
    enableColumnResizing: props.resizableColumns,
    enablePinning: props.pinnableColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row[props.rowId],
    style,
    onColumnOrderChange: props.onColumnOrderChange,
    onColumnSizingChange: (updater) => {
      const before = columnSizingState;
      const after = updater(columnSizingState);
      const diff = {};
      for (const key of Object.keys(after)) {
        if (before[key] !== after[key]) {
          diff[key] = after[key];
        }
      }
      props.onColumnsResize(diff);
    },
    onRowSelectionChange: (updater) => {
      const newSelection = updater(rowSelection);
      props.onSelectedRowIdsChange(Object.keys(newSelection));
    },
  });

  const parentRef = React.useRef(null);

  const prevSelectedRowIds = React.useRef();

  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => displayModeToRowHeight[props.displayMode],
    overscan: 5,
    scrollPaddingStart: displayModeToRowHeight[props.displayMode] / 2,
    scrollPaddingEnd: displayModeToRowHeight[props.displayMode] / 2,
  });

  React.useEffect(
    () => {
      prevSelectedRowIds.current = props.selectedRowIds;
      if (props.selectedRowIds?.length && props.selectedRowIds?.length >= (prevSelectedRowIds.current?.length ?? 0)) {
        const lastSelectedRowId = props.selectedRowIds[props.selectedRowIds.length - 1];
        const rowIndex = props.data.findIndex((x) => x[props.rowId] === lastSelectedRowId);
        if (rowIndex >= 0) {
          virtualizer.scrollToIndex(rowIndex);
        }
      }
    },
    [props.selectedRowIds, props.rowId, props.data, virtualizer],
  );

  const hasResizer = !!findResizingHeader(table);

  const lastPinnedColumn = columnPinningState.left[columnPinningState.left.length - 1];

  const renderTableHeader = (header) => {
    if (header.isPlaceholder) {
      // For group headers, we don't have a column associated with them
      return (
        <props.components.TableHeader
          className={(header.column.id === lastPinnedColumn) ? styles["is-pinned"] : undefined}
          colSpan={header.colSpan}
          style={getColumnStyle("header", header.column)}
        />
      );
    }
    return (
      <ColumnHeader
        className={
          cc([
            (header.column.id === lastPinnedColumn) ? styles["is-pinned"] : undefined,
            header.column.columnDef.className,
          ])
        }
        colSpan={header.colSpan}
        component={props.components.TableHeader}
        dragableColumns={props.dragableColumns}
        hasResizer={hasResizer}
        header={header}
        key={header.id}
        onColumnExpand={props.onColumnExpand}
        resizableColumns={props.resizableColumns}
        style={getColumnStyle("header", header.column)}
        table={table}
        tableHeight={props.height}
      >
        {
          props.headerRenderer && (header.column.columnDef.renderable ?? true)
            ?
            props.headerRenderer(
              header,
              header.column.columnDef,
            )
            :
            flexRender(
              header.column.columnDef.label ?? header.column.columnDef.header,
              header.getContext(),
            )
        }
      </ColumnHeader>
    );
  };

  const renderCellContent = (cell) => {
    if (props.cellRenderer && (cell.column.columnDef.renderable ?? true)) {
      return props.cellRenderer(
        cell,
        cell.column.columnDef,
        cell.row.original,
      );
    }
    return flexRender(
      cell.column.columnDef.cell,
      cell.getContext(),
    );
  };

  const renderTableCell = (cell) => {
    return (
      <props.components.TableCell
        key={cell.id}
        style={getColumnStyle("cell", cell.column)}
        className={
          cc([
            (cell.column.id === lastPinnedColumn) ? styles["is-pinned"] : undefined,
            cell.column.columnDef.className,
          ])
        }
      >
        { renderCellContent(cell) }
      </props.components.TableCell>
    );
  };

  const items = virtualizer.getVirtualItems();
  const [before, after] =
    items.length > 0
      ? [
        notUndefined(items[0]).start - virtualizer.options.scrollMargin,
        virtualizer.getTotalSize() - notUndefined(items[items.length - 1]).end,
      ]
      : [0, 0];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.root}>
      <CustomDragLayer />
      <props.components.TableContainer
        ref={parentRef}
        className={cc([
          styles["container"],
          styles[props.displayMode],
          (props.borders === "both" || props.borders === "horizontal") ? styles["has-horizontal-lines"] : undefined,
          (props.borders === "both" || props.borders === "vertical") ? styles["has-vertical-lines"] : undefined,
        ])}
        style={style}
      >
        <props.components.Table>
          <props.components.TableHead>
            {
              table.getHeaderGroups().map((headerGroup) => (
                <props.components.TableRow key={headerGroup.id}>
                  { headerGroup.headers.map(renderTableHeader) }
                </props.components.TableRow>
              ))
            }
          </props.components.TableHead>
          <props.components.TableBody>
            {
              before > 0 && (
                <props.components.TableRow>
                  <td colSpan={columns.length} style={{ height: before }} />
                </props.components.TableRow>
              )
            }
            {
              items.map((item) => {
                const row = rows[item.index];
                return (
                  <props.components.TableRow
                    key={row.id}
                    className={(row.getIsSelected()) ? styles["is-selected"] : undefined}
                  >
                    {
                    row.getVisibleCells().map(renderTableCell)}
                  </props.components.TableRow>
                );
              })
            }

            {
              after > 0 && (
                <props.components.TableRow>
                  <props.components.TableCell
                    colSpan={columns.length}
                    style={{ height: after }}
                  />
                </props.components.TableRow>
              )
            }
          </props.components.TableBody>
        </props.components.Table>
      </props.components.TableContainer>
      </div>
    </DndProvider>
  );
}

UiDataTable.displayName = "UiDataTable";

UiDataTable.propTypes = {
  borders: PropTypes.oneOf(["both", "horizontal", "vertical"]),
  cellRenderer: PropTypes.func,
  columns: PropTypes.array.isRequired,
  components: PropTypes.shape({
    Table: PropTypes.elementType,
    TableBody: PropTypes.elementType,
    TableCell: PropTypes.elementType,
    TableContainer: PropTypes.elementType,
    TableHead: PropTypes.elementType,
    TableHeader: PropTypes.elementType,
    TableRow: PropTypes.elementType,
  }),
  data: PropTypes.array.isRequired,
  displayMode: PropTypes.string,
  dragableColumns: PropTypes.bool,
  groupableColumns: PropTypes.bool,
  headerRenderer: PropTypes.func,
  height: PropTypes.number.isRequired,
  minColumnWidth: PropTypes.number,
  onColumnExpand: PropTypes.func.isRequired,
  onColumnOrderChange: PropTypes.func.isRequired,
  onColumnsResize: PropTypes.func.isRequired,
  onSelectedRowIdsChange: PropTypes.func.isRequired,
  pinnableColumns: PropTypes.bool,
  resizableColumns: PropTypes.bool,
  rowId: PropTypes.string,
  selectableRows: PropTypes.bool,
  selectedRowIds: PropTypes.array,
  width: PropTypes.number.isRequired,
};

UiDataTable.defaultProps = {
  borders: "both",
  components: {
    TableContainer: "div",
    Table: "table",
    TableHead: "thead",
    TableRow: "tr",
    TableHeader: "th",
    TableBody: "tbody",
    TableCell: "td",
  },
  // components: {
  //   TableContainer,
  //   Table,
  //   TableHead,
  //   TableRow,
  //   TableHeader: TableCell,
  //   TableBody,
  //   TableCell,
  // },
  displayMode: "comfortable",
  dragableColumns: true,
  groupableColumns: true,
  hasSelectionColumn: true,
  minColumnWidth: 300,
  pinnableColumns: true,
  resizableColumns: true,
};

export default UiDataTable;
