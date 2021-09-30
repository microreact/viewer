import PropTypes from "prop-types";
import React from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

function formatOptions(props) {
  if (props.children) {
    return props.children;
  }
  else if (props.options) {
    return props.options.map(
      (item) => (
        <MenuItem
          key={item.value}
          value={item.value}
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
              { item.label ?? item.value }
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
      )
    );
  }
  return undefined;
}

function UiSelect(props) {
  const { size, variant, style, options, ...rest } = props;
  return (
    <FormControl
      size={size}
      variant={variant}
      style={style}
      className={props.disabled ? "mr-disabled" : undefined}
    >
      <InputLabel>
        { props.label }
      </InputLabel>
      <Select
        {...rest}
        onChange={(event) => props.onChange(event.target.value)}
      >
        { formatOptions(props) }
      </Select>
    </FormControl>
  );
}

UiSelect.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  size: PropTypes.string,
  style: PropTypes.object,
  value: PropTypes.any.isRequired,
  variant: PropTypes.string,
};

UiSelect.defaultProps = {
  variant: "outlined",
  size: "small",
};

UiSelect.Item = MenuItem;

export default UiSelect;
