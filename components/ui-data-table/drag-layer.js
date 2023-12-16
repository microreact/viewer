import { useDragLayer } from "react-dnd";

import styles from "./drag-layer.module.css";

const layerStyles = {
  height: "100%",
  left: 0,
  pointerEvents: "none",
  position: "absolute",
  top: 0,
  width: "100%",
  zIndex: 100,
};

function getItemStyles(
  initialOffset,
  currentOffset,
  column,
) {
  if (initialOffset == null || currentOffset == null) {
    return {
      display: "none",
    };
  }

  const transform = `translate(${currentOffset.x}px, 0px)`;
  return {
    transform,
    WebkitTransform: transform,
    width: column.getSize(),
  };
}

function CustomDragLayer() {
  const { isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => {
      return {
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
      };
    });
  if (!isDragging) {
    return null;
  }
  return (
    <div style={layerStyles}>
      <div
        className={styles["drag-preview"]}
        style={getItemStyles(initialOffset, currentOffset, item)}
      />
    </div>
  );
}


// const DragPreviewImage = React.memo(
//   ({ connect, src }) => {
//     React.useEffect(() => {
//       if (typeof Image === "undefined") return;

//       let connected = false;
//       const img = new Image();
//       img.src = "http://localhost:3000/favicon.ico";
//       img.onload = () => {
//         connect(img);
//         connected = true;
//       };
//       return () => {
//         if (connected) {
//           connect(null);
//         }
//       };
//     });

//     return null;
//   },
// );

export default CustomDragLayer;
