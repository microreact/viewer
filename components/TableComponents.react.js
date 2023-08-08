import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import PropTypes from "prop-types";
import React from "react";

import TableHeaderMenu from "../containers/TableColumnMenu.react";

const DraggableHandle = () => (
  <div
    className="draggable-handle"
    title="Drag to move column"
  >
    <DragIndicatorOutlinedIcon
      fontSize="small"
    />
  </div>
);

export function HeaderTextComponent(props) {

  if (props.column.colDef.dataKey === "--microreact-selection-cell") {
    return null;
  }

  return (
    <React.Fragment>
      {
        !props.column.colDef.suppressMovable && (
          <DraggableHandle />
        )
      }

      <button
        onClick={() => props.column.colDef.onColourByFieldChange(props.column.colDef.dataKey)}
        title={`Set colour by column to ${props.displayName}`}
      >
        {props.displayName}
      </button>

      {
        props.column.colDef.controls && (
          <TableHeaderMenu
            tableColumn={props.column.colDef}
          />
        )
      }
    </React.Fragment>
  );
}

HeaderTextComponent.propTypes = {
  column: PropTypes.object,
  displayName: PropTypes.string,
};
