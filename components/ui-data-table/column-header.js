import React from "react";
import PropTypes from "prop-types";
import cc from "classcat";
import {
  useDrag,
  useDrop,
} from "react-dnd";
import DragIndicatorSharpIcon from "@mui/icons-material/DragIndicatorSharp";

// import { flexRender } from "@tanstack/react-table";

import styles from "./column-header.module.css";

function getResolvedColumnOrder(table) {
  const { columnOrder } = table.getState();
  const resolvedColumnOrder = [ ...columnOrder ];
  for (const column of table.options.columns) {
    if (!resolvedColumnOrder.includes(column.id)) {
      resolvedColumnOrder.push(column.id);
    }
  }

  return resolvedColumnOrder;
}

const reorderColumn = (
  columnOrder,
  draggedColumnId,
  targetColumnId,
) => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0]
  );
  return [...columnOrder];
};

function ColumnHeader(props) {
  const { column } = props.header;

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: "column",
    drop: (draggedColumn) => {
      const newColumnOrder = reorderColumn(
        getResolvedColumnOrder(props.table),
        draggedColumn.id,
        props.header.column.id,
      );
      props.table.setColumnOrder(newColumnOrder);
    },
    collect: (monitor) => {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
    item: () => column,
    type: "column",
    // options: {
    //   dropEffect: "move"
    // }
  });

  return (
    <props.component
      ref={dropRef}
      colSpan={props.header.colSpan}
      className={
        cc([
          styles["table-header"],
          props.className,
        ])
      }
      style={
        isDragging
          ?
          {
            ...props.style,
            opacity: 0.5,
          }
          :
          props.style
      }
    >
      <div
        className={styles["header-content"]}
      >
        {
          (canDrop && !!props.header.column.columnDef.dragable) && (
            <div
              className={styles["drop-target"]}
              style={{ height: props.table.options.meta.style.height }}
            />
          )
        }

        {
          (canDrop && isOver && props.header.column.columnDef.enableDragging) && (
            <div
              className={styles["is-dragging-over"]}
              style={{ height: props.table.options.meta.style.height }}
            />
          )
        }

        {
          (props.header.column.columnDef.enableDragging) && (
            <div
              className={styles["draggable-handle"]}
              ref={dragRef}
              title="Drag to move column"
            >
              <DragIndicatorSharpIcon
              />
            </div>
          )
        }

        {
          (
            props.resizableColumns
            &&
            !!props.header.column.columnDef.resizable
            &&
            (!props.hasResizer || props.header.column.getIsResizing())
          ) && (
            <div
              onMouseDown={props.header.getResizeHandler()}
              onTouchStart={props.header.getResizeHandler()}
              onDoubleClick={() => props.onColumnExpand(props.header.column.id)}
              className={cc([
                styles["resizer"],
                props.header.column.getIsResizing() ? styles["isResizing"] : undefined,
              ])}
              style={
                {
                  height: props.tableHeight,
                  transform: (
                    // columnResizeMode === "onEnd" &&
                    props.header.column.getIsResizing()
                      ?
                      `translateX(${props.table.getState().columnSizingInfo.deltaOffset}px)`
                      :
                      ""
                  ),
                }
              }
            />
          )
        }

        <div
          ref={previewRef}
          className={styles["column-label"]}
        >
          { props.children }
        </div>

      </div>
    </props.component>
  );
}

ColumnHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  dragableColumns: PropTypes.bool.isRequired,
  hasResizer: PropTypes.bool.isRequired,
  header: PropTypes.object.isRequired,
  onColumnExpand: PropTypes.func.isRequired,
  resizableColumns: PropTypes.bool.isRequired,
  style: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired,
  tableHeight: PropTypes.number.isRequired,
};

export default ColumnHeader;
