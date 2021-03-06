import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import PropTypes from "prop-types";
import React from "react";
import TextField from "@material-ui/core/TextField";

import "../css/ui-slider.css";

const UiTextfield = React.memo(
  (props) => {
    return (
      <TextField
        autoFocus={props.autoFocus}
        className={props.className}
        disabled={props.disabled}
        InputProps={
          props.clearable
            ?
            {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => props.onChange(props.nullValue)}
                    edge="end"
                  >
                    <ClearRoundedIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }
            :
            undefined
        }
        helperText={props.helperText}
        label={props.label}
        onChange={(event) => props.onChange(event.target.value, event)}
        size="small"
        style={props.style}
        type={props.type}
        value={props.value}
        variant={props.variant}
      />
    );
  }
);

UiTextfield.displayName = "UiTextfield";

UiTextfield.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  clearable: PropTypes.bool,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  label: PropTypes.string,
  nullValue: PropTypes.string,
  onChange: PropTypes.func,
  style: PropTypes.object,
  type: PropTypes.string,
  value: PropTypes.string,
  variant: PropTypes.string,
};

export default UiTextfield;
