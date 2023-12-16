import React from "react";
import PropTypes from "prop-types";
import cc from "classcat";
import {
  useDrag,
  useDrop,
} from "react-dnd";
import DragIndicatorSharpIcon from "@mui/icons-material/DragIndicatorSharp";
import { flexRender } from "@tanstack/react-table";
import styles from "./data-table.module.css";

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

function DraggableColumnHeader({ header, table }) {
  const { getState, setColumnOrder } = table;
  const { columnOrder } = getState();
  const { column } = header;

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: "column",
    drop: (draggedColumn) => {
      const newColumnOrder = reorderColumn(
        columnOrder,
        draggedColumn.id,
        column.id,
      );
      setColumnOrder(newColumnOrder);
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
    <th
      ref={dropRef}
      colSpan={header.colSpan}
      // style={{ opacity: isDragging ? 0.5 : 1 }}
      className={
        cc([
          styles["table-header"],
        ])
      }
      style={
        {
          minWidth: header.getSize(),
          maxWidth: header.getSize(),
        }
      }
    >
      {
        (canDrop) && (
          <div
            className={styles["drop-target"]}
            style={{ height: table.options.meta.style.height }}
          />
        )
      }

      {
        (canDrop && isOver) && (
          <div
            className={styles["is-dragging-over"]}
            style={{ height: table.options.meta.style.height }}
          />
        )
      }

      <span
        ref={previewRef}
        className={
          cc([
            // styles["drag-preview"],
            // isDragging && styles["is-dragging"],
          ])
        }
        // className={styles["drag-preview"]}
        // style={{ height: table.options.meta.style.height }}
      >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
      </span>
      <div
        className={styles["draggable-handle"]}
        ref={dragRef}
        title="Drag to move column"
      >
        <DragIndicatorSharpIcon
        />
      </div>
    </th>
  );
}

DraggableColumnHeader.propTypes = {
  header: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired,
};

export default DraggableColumnHeader;
