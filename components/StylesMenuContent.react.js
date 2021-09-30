import PropTypes from "prop-types";
import React from "react";
import Divider from "@material-ui/core/Divider";

import "../css/styles-menu-content.css";

import UiCombobox from "./UiCombobox.react";

import { DataColumn } from "../utils/prop-types";
import DataColumnColourSettingsMenu from "../containers/ColourSettingsMenu.react";

class StylesMenuContent extends React.PureComponent {

  render() {
    const { props } = this;
    return (
      <div
        className="mr-styles-menu-content"
      >
        <UiCombobox
          label="Labels Column"
          options={props.labelFields}
          onChange={(item) => props.onLabelByFieldChange(item.name)}
          value={props.labelByDataField}
        />

        <Divider />

        <UiCombobox
          label="Colour Column"
          options={props.colourableFields}
          onChange={(item) => props.onColourByFieldChange(item.name)}
          value={props.colourByDataField}
        />

        <DataColumnColourSettingsMenu
          label="Colour Palette"
          field={props.colourByDataField.name}
        />

        {/* <DefaultColourPicker
          onDefaultColourChange={props.onDefaultColourChange}
          defaultColour={props.defaultColour}
        > */}

        {
          (props.shapableDataFields.length > 0) && (
            <React.Fragment>

              <Divider />

              <UiCombobox
                clearable
                label="Shape Column"
                onChange={(item) => props.onShapeByFieldChange(item?.name)}
                options={props.shapableDataFields}
                value={props.shapeByDataField}
              />
            </React.Fragment>
          )
        }
      </div>
    );
  }
}

StylesMenuContent.displayName = "StylesColumns";

StylesMenuContent.propTypes = {
  colourableFields: PropTypes.arrayOf(DataColumn).isRequired,
  colourByDataField: DataColumn.isRequired,
  defaultColour: PropTypes.string.isRequired,
  labelByDataField: DataColumn,
  labelFields: PropTypes.arrayOf(DataColumn).isRequired,
  onColourByFieldChange: PropTypes.func.isRequired,
  onDefaultColourChange: PropTypes.func.isRequired,
  onLabelByFieldChange: PropTypes.func.isRequired,
  onShapeByFieldChange: PropTypes.func.isRequired,
  shapableDataFields: PropTypes.arrayOf(DataColumn).isRequired,
  shapeByDataField: DataColumn,
};

export default StylesMenuContent;
