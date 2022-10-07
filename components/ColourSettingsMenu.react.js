import PropTypes from "prop-types";
import React from "react";
import clsx from "clsx";
import Button from "@mui/material/Button";

import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Input from '@mui/material/Input';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import ColourSettingsContent from "../containers/ColourSettingsContent.react";
import UiPopoverMenu from "./UiPopoverMenu.react";

// import "../styles/colour-settings-menu.css";
import { ColourModes } from "../utils/prop-types";

const DataColumnColourSettingsButton = React.forwardRef(
  (props, ref) => {

    return (
      <FormControl
        variant="outlined"
        size="small"
        className={
          clsx(
            props.className,
            "mr-colour-settings-button",
          )
        }
      >
        <InputLabel
          disableAnimation
          shrink
          variant="outlined"
        >
          {props.label}
        </InputLabel>
        <OutlinedInput
          id="input-with-icon-adornment"
          endAdornment={
            <InputAdornment position="end">
              <ArrowDropDownIcon />
            </InputAdornment>
          }
          onClick={props.onClick}
          label={props.label}
          ref={ref}
          readOnly
          value={
            (props.colourMode === "categorical") ? "Categorical" :
              (props.colourMode === "gradient") ? "Gradient" :
                (props.colourMode === "field") ? `Reuse ${props.colourSettings?.field}` :
                  null
          }
        />
      </FormControl>
    )

    return (
      <Button
        variant="outlined"
        // size="small"
        color="inherit"
        onClick={props.onClick}
        className={
          clsx(
            props.className,
            "mr-colour-settings-button",
            "MuiFormControl-root",
          )
        }
        ref={ref}
      >
        {
          (props.colourMode === "categorical") ? "Categorical" :
            (props.colourMode === "gradient") ? "Gradient" :
              (props.colourMode === "field") ? `Reuse ${props.colourSettings?.field}` :
                null
        }
        <svg
          className="MuiSvgIcon-root MuiSelect-icon MuiSelect-iconOutlined" focusable="false" viewBox="0 0 24 24"
          aria-hidden="true">
          <path d="M7 10l5 5 5-5z"></path>
        </svg>
        { props.label && (<span>​{ props.label }</span>) }
      </Button>
    );
  }
);

DataColumnColourSettingsButton.displayName = "DataColumnColourSettingsButton";

DataColumnColourSettingsButton.propTypes = {
  className: PropTypes.string,
  colourMode: ColourModes,
  colourSettings: PropTypes.object,
  label: PropTypes.string,
  onClick: PropTypes.func,
};

class DataColumnColourSettingsMenu extends React.PureComponent {

  menuRef = React.createRef();

  closeMenu = () => {
    this.menuRef.current?.close();
  }

  render() {
    const { props } = this;
    return (
      <UiPopoverMenu
        button={DataColumnColourSettingsButton}
        buttonProps={props}
        className="mr-colour-settings-menu"
        disableCloseButton
        ref={this.menuRef}
      >
        <ColourSettingsContent
          field={props.field}
          menuRef={this.menuRef}
          onMenuClose={this.closeMenu}
        />
      </UiPopoverMenu>
    );
  }

}

DataColumnColourSettingsMenu.displayName = "DataColumnColourSettingsMenu";

DataColumnColourSettingsMenu.propTypes = {
  colourMode: ColourModes,
  field: PropTypes.string.isRequired,
};

export default DataColumnColourSettingsMenu;
