import IconButton from "@material-ui/core/Button";
import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import TuneRoundedIcon from "@material-ui/icons/TuneRounded";

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
        color={active ? "primary" : undefined}
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
