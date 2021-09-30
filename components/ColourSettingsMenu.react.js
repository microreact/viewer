import PropTypes from "prop-types";
import React from "react";
import clsx from "clsx";

import ColourSettingsContent from "../containers/ColourSettingsContent.react";
import UiPopoverMenu from "./UiPopoverMenu.react";

import "../css/colour-settings-menu.css";
import { ColourModes } from "../utils/prop-types";

const DataColumnColourSettingsButton = React.forwardRef(
  (props, ref) => {

    return (
      <button
        onClick={props.onClick}
        className={
          clsx(
            props.className,
            "mr-colour-settings-button",
            "MuiFormControl-root"
          )
        }
        ref={ref}
      >
        <div
          className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl MuiInputBase-marginDense MuiOutlinedInput-marginDense"
        >
          <div
            className="MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiSelect-outlined MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputMarginDense MuiOutlinedInput-inputMarginDense"
            role="button"
          >
            {
              (props.colourMode === "categorical") ? "Categorical" :
                (props.colourMode === "gradient") ? "Gradient" :
                  (props.colourMode === "field") ? `Reuse ${props.colourSettings?.field}` :
                    null
            }
          </div>
          <svg
            className="MuiSvgIcon-root MuiSelect-icon MuiSelect-iconOutlined" focusable="false" viewBox="0 0 24 24"
            aria-hidden="true">
            <path d="M7 10l5 5 5-5z"></path>
          </svg>
          <fieldset aria-hidden="true"
            className="MuiOutlinedInput-notchedOutline">
            <legend>
               { props.label && (<span>​{ props.label }</span>) }
            </legend>
          </fieldset>
        </div>
      </button>
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
