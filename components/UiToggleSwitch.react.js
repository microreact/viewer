import classnames from "classnames";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import PropTypes from "prop-types";
import React from "react";
import Switch from "@material-ui/core/Switch";

import "../css/ui-switch.css";

const UiToggleSwitch = React.memo(
  (props) => (
    <FormControlLabel
      className={
        classnames(
          "mr-ui-switch",
          "MuiFormControl-root",
          props.className,
        )
      }
      control={
        <Switch
          checked={props.value}
          color="primary"
          onChange={(event) => props.onChange(event.target.checked)}
        />
      }
      label={props.label}
      labelPlacement={props.labelPlacement}
    />
  )
);

UiToggleSwitch.displayName = "UiToggleSwitch";

UiToggleSwitch.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  labelPlacement: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
};

UiToggleSwitch.defaultProps = {
  labelPlacement: "start",
};

export default UiToggleSwitch;
