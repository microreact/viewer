import IconButton from "@mui/material/Button";
import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

const UiControlsButton = React.forwardRef(
  (props, ref) => {
    const {
      active,
      children,
      className,
      ...rest
    } = props;

    return (
      <IconButton
        {...rest}
        className={
          classnames(
            "mr-controls-button",
            className,
          )
        }
        color={active ? "primary" : "inherit"}
        size="small"
        variant="contained"
        ref={ref}
      >
        { children }
      </IconButton>
    );
  }
);

UiControlsButton.displayName = "UiControlsButton";

UiControlsButton.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
};

UiControlsButton.defaultProps = {
  active: false,
  children: (<TuneRoundedIcon />),
};

export default UiControlsButton;
