/* eslint "react/prop-types": 0 */

import React from "react";
import { sortableContainer, sortableElement, sortableHandle } from "react-sortable-hoc";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import CheckBoxTwoToneIcon from "@mui/icons-material/CheckBoxTwoTone";
import CheckBoxOutlineBlankTwoToneIcon from "@mui/icons-material/CheckBoxOutlineBlankTwoTone";

// import "../styles/table.css";
import TableHeaderMenu from "../containers/TableColumnMenu.react";

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

export const HeaderCellComponent = (args) => {
  const { index, children, ...rest } = args;
  return (
    <SortableItem key={`item-${index}`} index={index}>
      <div
        {...rest}
        onClick={
          (event) => {
            if (
              event.target
              &&
              event.target.classList
              &&
              (
                event.target.classList.contains("BaseTable__header-cell")
                ||
                event.target.classList.contains("BaseTable__header-cell-text")
                ||
                event.target.classList.contains("BaseTable__sort-indicator")
              )
            ) {
              rest.onClick(event);
            }
          }
        }
      >
        {children}
      </div>
    </SortableItem>
  );
};

const HeaderTextComponent = (args) => {
  if (args.column.dataKey === "--microreact-selection-cell") {
    return null;
  }

  return (
    <React.Fragment>
      {
        (!args.column.frozen) && (<DraggableHandle />)
      }
      <div className={args.className}>
        { args.column.title }
      </div>
      <TableHeaderMenu
        tableColumn={args.column}
      />
    </React.Fragment>
  );
};

const CellContent = (attributes) => {
  if (attributes.column.dataKey === "--microreact-selection-cell") {
    return (
      <div
        className={attributes.className}
        style={{ cursor: "pointer" }}
        onClick={
          (event) => attributes.container.props.onSelectRows(
            [ attributes.rowData[0] ],
            !(event.metaKey || event.ctrlKey),
          )
        }
      >
        {
          attributes.column.selectedIds?.includes(attributes.rowData[attributes.container.props.rowKey])
            ?
            <CheckBoxTwoToneIcon />
            :
            <CheckBoxOutlineBlankTwoToneIcon />
        }
      </div>
    );
  }

  return (
    <div
      className={attributes.className}
    >
      { attributes.cellData }
    </div>
  );
};

const tabelComponents = {
  TableCell: CellContent,
  TableHeaderCell: HeaderTextComponent,
};

export default tabelComponents;
