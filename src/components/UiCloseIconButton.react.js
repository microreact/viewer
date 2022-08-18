import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import React from "react";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";

const UiCloseIconButton = React.memo(
  (props) => (
    <IconButton
      className={props.className}
      color={ props.active ? "primary" : undefined }
      onClick={props.onClick}
      size="small"
      style={props.style}
      title={props.title || "Close"}
    >
      <CloseRoundedIcon />
      { props.children }
    </IconButton>
  ),
);

UiCloseIconButton.displayName = "UiCloseIconButton";

UiCloseIconButton.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
  style: PropTypes.object,
};

export default UiCloseIconButton;
