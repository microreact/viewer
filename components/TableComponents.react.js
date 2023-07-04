/* eslint "react/prop-types": 0 */

import React from "react";
import { sortableContainer, sortableElement, sortableHandle } from "react-sortable-hoc";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import CheckBoxTwoToneIcon from "@mui/icons-material/CheckBoxTwoTone";
import CheckBoxOutlineBlankTwoToneIcon from "@mui/icons-material/CheckBoxOutlineBlankTwoTone";

// import "../styles/table.css";
import TableHeaderMenu from "../containers/TableColumnMenu.react";

const cursorStyle = { cursor: "pointer" };

const SortableItem = sortableElement(
  ({ children }) => children
);

export const SortableContainer = sortableContainer(
  ({ children }) => {
    return (
      <div
        style={
          {
            display: "flex",
            width: "100%",
            height: "100%",
            // "white-space": "nowrap",
            alignItems: "center",
          }
        }
      >
        {children}
      </div>
    );
  }
);

const DraggableHandle = sortableHandle(
  () => (
    <div
      className="draggable-handle"
      title="Drag to move column"
    >
      <DragIndicatorOutlinedIcon
        fontSize="small"
      />
    </div>
  )
);

// export const HeaderCellComponent = (props) => {
//   console.log("HeaderCellComponent props: ", { props })

//   const { index, children, ...rest } = props;
//   return (
//     <SortableItem key={`item-${index}`} index={index}>
//       <div
//         {...rest}
//         onClick={
//           (event) => {
//             if (
//               event.target
//               &&
//               event.target.classList
//               &&
//               (
//                 event.target.classList.contains("BaseTable__header-cell")
//                 ||
//                 event.target.classList.contains("BaseTable__header-cell-text")
//                 ||
//                 event.target.classList.contains("BaseTable__sort-indicator")
//               )
//             ) {
//               rest.onClick(event);
//             }
//           }
//         }
//       >
//         {children}
//       </div>
//     </SortableItem>
//   );
// };

export function HeaderTextComponent(props) {
  console.log("HeaderTextComponent props: ", { props })
  if (props.column.colDef.dataKey === "--microreact-selection-cell") {
    return null;
  }

  return (
    <React.Fragment>
      {!props.column.colDef.frozen && (
        <DraggableHandle />
      )}

      <div className={props.className}>
        {props.displayName}
      </div>

      {props.column.colDef.controls && (
        <TableHeaderMenu
          tableColumn={props.column.colDef}
        />
      )}
    </React.Fragment>
  );
};


