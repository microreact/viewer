import PropTypes from "prop-types";
import React from "react";
import Box from "@mui/material/Box";

import { ColourModes, DataColumn, StylePalette } from "../utils/prop-types";

import CategoricalColourPalettePicker from "./CategoricalColourPalettePicker.react";
import GradientColourPalettePicker from "./GradientColourPalettePicker.react";
import UiToggleButtons from "./UiToggleButtons.react";
import UiFieldsList from "./UiFieldsList.react";

class ColourSettingsContent extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      colourMode: props.colourMode,
    };

    if (!props.dataColumn.isNumeric) {
      this.colourModeOptions.splice(1, 1);
    }
  }

  elementRef = React.createRef()

  colourModeOptions = [
    {
      label: "Categorical",
      value: "categorical",
    },
    {
      label: "Gradient",
      value: "gradient",
    },
    {
      label: "Reuse",
      value: "field",
    },
  ]

  renderCategoricalMode() {
    const { props } = this;

    return (
      <CategoricalColourPalettePicker
        field={props.field}
        onChange={
          (palette) => {
            props.onDataColumnColourPaletteChange(
              palette.name,
            );
          }
        }
        onMenuClose={props.onMenuClose}
        value={props.colourPalette}
      />
    );
  }

  renderGradientMode() {
    const { props } = this;

    return (
      <GradientColourPalettePicker
        field={props.field}
        onChange={
          (palette) => {
            props.onDataColumnColourPaletteChange(
              palette.name,
              "gradient",
            );
          }
        }
        onMenuClose={props.onMenuClose}
        value={props.colourPalette}
      />
    );
  }

  renderFieldMode() {
    const { props } = this;

    return (
      <UiFieldsList
        columns={props.dataColumns}
        onChange={(value) => props.onDataColumnColourFieldChange(value)}
        value={props.colourSettings?.field}
        valueProperty="name"
      />
    );
  }

  render() {
    const { state } = this;

    return (
      <Box
        display="flex"
        flexDirection="column"
      >
        <UiToggleButtons
          // label="Colour Mode"
          onChange={(value) => this.setState({ colourMode: value ?? state.colourMode })}
          value={state.colourMode}
        >
          {
            this.colourModeOptions.map(
              (x) => <small key={x.value} value={x.value}>{ x.label }</small>
            )
          }
        </UiToggleButtons>

        {/* <UiSelect
          label="Colour Mode"
          onChange={(value) => this.setState({ colourMode: value })}
          options={this.colourModeOptions}
          size="small"
          value={state.colourMode}
          variant="outlined"
        /> */}

        {
          (state.colourMode === "categorical") ? this.renderCategoricalMode() :
            (state.colourMode === "gradient") ? this.renderGradientMode() :
              (state.colourMode === "field") ? this.renderFieldMode() :
                null
        }
      </Box>
    );

  }

}

ColourSettingsContent.displayName = "ColourSettingsContent";

ColourSettingsContent.propTypes = {
  colourMode: ColourModes,
  colourPalette: StylePalette,
  colourSettings: PropTypes.object,
  dataColumn: DataColumn.isRequired,
  dataColumns: PropTypes.arrayOf(DataColumn),
  field: PropTypes.string.isRequired,
  onDataColumnColourFieldChange: PropTypes.func.isRequired,
  onDataColumnColourPaletteChange: PropTypes.func.isRequired,
  onMenuClose: PropTypes.func.isRequired,
};

export default ColourSettingsContent;
