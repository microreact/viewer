import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import React from "react";

const UiIconButton = React.forwardRef(
  (props, ref) => {
    if (props.hidden) {
      return null;
    }

    return (
      <IconButton
        aria-label={props.title}
        className={props.className}
        color={ props.active ? "primary" : props.colour }
        disabled={props.disabled}
        onClick={props.onClick}
        ref={ref}
        size="small"
        style={props.style}
        title={props.title}
      >
        { props.children }
      </IconButton>
    );
  }
);

UiIconButton.displayName = "UiIconButton";

UiIconButton.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  colour: PropTypes.string,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  title: PropTypes.string,
};

export default UiIconButton;
