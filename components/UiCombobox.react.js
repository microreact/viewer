import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { emptyArray, fullWithStyle } from "../constants";

import "../css/ui-combobox.css";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/*
// getOptionLabel={(option) => typeof option === "string" ? option : option.label || option.name}
//
// getOptionLabel={(option) => ((typeof option === "string") ? option : (option.label || option.name))}
//
// if the type of option is string, then return it, otherwsie return the option's label or name
//
// if (the type of option is string) then
//   return it,
//  otherwsie
//    return the option's label or name
//
// if (typeof option === "string") {
//   return option;
// }
// else {
//   return option.label || option.name;
// }
*/
function getOptionLabel(option) {
  if (typeof option === "string" || typeof option === "number") {
    return option.toString();
  }
  else {
    return option.label || option.name;
  }
}

function renderMultiOption(option, { selected }) {
  return (
    <React.Fragment>
      <Checkbox
        icon={icon}
        checkedIcon={checkedIcon}
        style={{ marginRight: 8 }}
        checked={selected}
      />
      { getOptionLabel(option) }
    </React.Fragment>
  );
}

const UiCombobox = React.memo((props) => {
  const defaultOptionRenderer = props.multiple ? renderMultiOption : undefined;
  const defaultOptionGroupBy = props.grouped ? (option) => option.group : undefined;
  return (
    <Autocomplete
      debug={props.debug}
      autoHighlight
      className={
        clsx(
          "mr-ui-combobox",
          "MuiFormControl-root",
          props.className,
        )
      }
      disableClearable={!props.clearable}
      disableCloseOnSelect={!!props.multiple}
      getOptionLabel={getOptionLabel}
      groupBy={props.groupBy ?? defaultOptionGroupBy}
      // renderGroup={props.groupRenderer ?? undefined}
      renderOption={props.optionRenderer ?? defaultOptionRenderer}
      // limitTags={props.limitTags}
      multiple={props.multiple}
      onChange={(event, item) => props.onChange(item, event)}
      options={props.options}
      renderInput={
        (params) => (
          <div ref={params.InputProps.ref}>
            {/* { (params.inputProps.ref.current?.attributes["aria-activedescendant"]) && props.perpendContent } */}
            <TextField
              {...params}
              autoFocus={props.autoFocus}
              error={props.error}
              fullWidth
              helperText={props.helperText}
              label={props.label}
              placeholder={props.placeholder}
              required={props.required}
              variant="outlined"
              inputProps={{
                ...params.inputProps,
                autoComplete: "disabled", // disable autocomplete and autofill
              }}
            />
            {/* { (params.inputProps.ref.current?.attributes["aria-activedescendant"]) && props.appendContent } */}
          </div>
        )
      }
      size="small"
      style={fullWithStyle}
      value={props.value || (props.multiple ? emptyArray : null)}
      PaperComponent={
        (args) => (
          <Paper
            {...args}
            className={
              clsx(
                args.className,
                props.className,
              )
            }
          />
        )
      }
      // PopperComponent={
      //   props.appendContent ?
      //     (params) => {
      //       const { children } = params;
      //       return (
      //         <Popper {...params}>
      //           { props.perpendContent }
      //           { children }
      //           { props.appendContent }
      //         </Popper>
      //       );
      //     }
      //     :
      //     undefined
      // }
    />
  );
});

UiCombobox.displayName = "UiCombobox";

UiCombobox.defaultProps = {
  clearable: false,
  limitTags: 2,
};

UiCombobox.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  clearable: PropTypes.bool,
  debug: PropTypes.bool,
  grouped: PropTypes.bool,
  helperText: PropTypes.string,
  label: PropTypes.string,
  limitTags: PropTypes.number,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.any,
};

export default UiCombobox;
