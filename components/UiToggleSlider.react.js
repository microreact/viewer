import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import Slider from "@material-ui/core/Slider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import Animation from "./Animation.react";

const UiToggleSlider = React.memo(
  (props) => {
    return (
      <div
        className={
          classnames(
            "mr-ui-slider",
            "mr-ui-switch",
            props.className,
          )
        }
        title={props.title}
      >
        <FormControlLabel
          control={
            <Switch
              checked={props.checked}
              color="primary"
              onChange={(event) => props.onCheckedChange(event.target.checked)}
            />
          }
          label={
            props.checked
              ?
              <React.Fragment>
                {props.label}: <strong>{props.value}</strong>{props.unit}
              </React.Fragment>
              :
              props.label
          }
          labelPlacement="start"
        />
        <Animation in={props.checked}>
          <Slider
            max={props.max}
            min={props.min}
            onChange={(event, value) => props.onChange(value, event)}
            value={props.value}
          />
        </Animation>
      </div>
    );
  }
);

UiToggleSlider.displayName = "UiToggleSlider";

UiToggleSlider.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onCheckedChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  unit: PropTypes.string,
  value: PropTypes.number.isRequired,
  checked: PropTypes.bool.isRequired,
};

export default UiToggleSlider;
