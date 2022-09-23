import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import Slider from "@mui/material/Slider";

// import "../styles/ui-slider.css";

const UiSlider = React.memo(
  (props) => {
    return (
      <div
        className={
          classnames(
            "mr-ui-slider",
            props.className,
          )
        }
        title={props.title}
      >
        <label>
          {props.label}: <strong>{props.value}</strong>{props.unit}
        </label>
        <Slider
          max={props.max}
          min={props.min}
          onChange={(event, value) => props.onChange(value, event)}
          value={props.value}
        />
      </div>
    );
  }
);

UiSlider.displayName = "UiSlider";

UiSlider.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  unit: PropTypes.string,
  value: PropTypes.number.isRequired,
};

export default UiSlider;
