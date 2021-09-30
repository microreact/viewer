import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import "../css/default-colour-picker.css";

import { fullWithStyle } from "../constants";

import UiTextfield from "./UiTextfield.react";

class DefaultColourPicker extends React.PureComponent {

  render() {
    const { props } = this;
    return (
      <UiTextfield
        className={
          classnames(
            "mr-default-colour-picker",
            props.defaultColour === "transparent" ? "mr-null-value" : null,
          )
        }
        clearable
        helperText="Used for missing values"
        label="Default colour"
        nullValue="transparent"
        onChange={props.onDefaultColourChange}
        type="color"
        value={props.defaultColour}
        variant="outlined"
        style={fullWithStyle}
      >
        <span>transparent</span>
      </UiTextfield>
    );
  }
}

DefaultColourPicker.displayName = "DefaultColourPicker";

DefaultColourPicker.propTypes = {
  defaultColour: PropTypes.string.isRequired,
  onDefaultColourChange: PropTypes.func.isRequired,
};

export default DefaultColourPicker;
