import PropTypes from "prop-types";
import ListSubheader from "@mui/material/ListSubheader";
import React from "react";
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// import "../styles/ui-side-pane-header.css";

// import UiIconButton from "./UiIconButton.react";

const UiSidePaneHeader = React.memo(
  (props) => {
    return (
      <ListSubheader
        className="mr-ui-side-pane-header"
        disableSticky={props.disableSticky}
      >
        { props.title }
        <div className="mr-actions">
          { props.children }
          {/*
          <UiIconButton
            onClick={props.onClose}
          >
            <CloseRoundedIcon />
          </UiIconButton>
          */}
        </div>
      </ListSubheader>
    );
  }
);

UiSidePaneHeader.displayName = "UiSidePaneHeader";

UiSidePaneHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disableSticky: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node.isRequired,
};

export default UiSidePaneHeader;
