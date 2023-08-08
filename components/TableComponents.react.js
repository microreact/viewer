import Button from "@mui/material/Button";
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

      <Button
        className="mr-table-header-cell-label"
        onClick={() => props.column.colDef.onColourByFieldChange(props.column.colDef.dataKey)}
        title={`Set colour by column to ${props.displayName}`}
        variant="text"
      >
        {props.displayName}
      </Button>

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
