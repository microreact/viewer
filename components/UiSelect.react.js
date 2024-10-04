import PropTypes from "prop-types";
import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import clsx from "clsx";

// import "../styles/ui-select.css";

function renderItem(item) {
  const value = (typeof item === "string") ? item : item.value;
  const label = (typeof item === "string") ? item : item.label;
  return (
    <MenuItem
      key={value}
      value={value}
    >
      <Box
        display="flex"
        alignItems="center"
      >
        { item.icon }
        <Box
          display="flex"
          flexDirection="column"
        >
          { label ?? value }
          {
            item.secondary && (
              <Typography
                color="textSecondary"
                component="small"
                variant="caption"
              >
                { item.secondary }
              </Typography>
            )
          }
        </Box>
      </Box>
    </MenuItem>
  );
}

function formatOptions(props) {
  if (props.children) {
    return props.children;
  }
  else if (props.options) {
    return props.options.map(renderItem);
  }
  return undefined;
}

function UiSelect(props) {
  const { size, variant, style, options, nullValue, nullLabel, className, ...rest } = props; // eslint-disable-line no-unused-vars
  return (
    <FormControl
      size={size}
      variant={variant}
      style={style}
      className={
        clsx(
          "mr-ui-select",
          props.disabled ? "mr-disabled" : undefined,
          className,
        )
      }
    >
      <InputLabel>
        { props.label }
      </InputLabel>
      <Select
        {...rest}
        onChange={(event) => props.onChange(event.target.value)}
      >
        { nullValue && renderItem({ value: nullValue, label: nullLabel }) }
        { formatOptions(props) }
      </Select>
    </FormControl>
  );
}

UiSelect.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  nullLabel: PropTypes.string,
  nullValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  size: PropTypes.string,
  style: PropTypes.object,
  value: PropTypes.any.isRequired,
  variant: PropTypes.string,
};

UiSelect.defaultProps = {
  size: "small",
  variant: "outlined",
};

UiSelect.Item = MenuItem;

export default UiSelect;
