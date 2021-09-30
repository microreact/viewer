import PropTypes from "prop-types";
import React from "react";
import { createSelector } from "reselect";

import { colourSteps, colourRanges } from "../utils/colours";
import UiSelect from "./UiSelect.react";
import { StylePalette } from "../utils/prop-types";
import { triggerWindowResize } from "../utils/browser";

import ColourPaletteList from "./ColourPaletteList.react";
import CustomColourPaletteEditor from "../containers/CustomColourPaletteEditor.react";
import UiToggleSwitch from "./UiToggleSwitch.react";

class GradientColourPalettePicker extends React.PureComponent {

  constructor(props) {
    super(props);
    const isCustom = (
      props?.value?.type === "custom"
      &&
      props?.value?.bins >= 0
    );
    this.state = {
      numberOfBins: props?.value?.bins ?? (props?.value?.entries?.length === 2 ? 0 : props?.value?.entries?.length),
      custom: isCustom,
    };
  }

  setState(updater) {
    super.setState(
      updater,
      triggerWindowResize,
    );
  }

  itemsSelector = createSelector(
    (params) => params.numberOfBins,
    (
      numberOfBins,
    ) => {
      return this.props.colourPalettes.filter(
        (x) => {
          const numberOfSteps = (
            (numberOfBins === 0)
              ?
              2
              :
              numberOfBins
          );
          return (
            // (
            //   paletteType === "all"
            //   ||
            //   paletteType === x.type
            // )
            // &&
            (
              numberOfSteps === x.entries.length
            )
          );
        }
      );
    }
  );

  stepSizeOptions = colourSteps.map(
    (value) => {
      if (value === 2) {
        return {
          value: 0,
          label: "Continuous",
        };
      }
      else {
        return { value };
      }
    }
  )

  render() {
    const { props, state } = this;

    return (
      <React.Fragment>

        {
          !props.onlyContinuousPalettes && (
            <UiSelect
              label="Number of steps"
              onChange={(value) => this.setState({ numberOfBins: value })}
              options={this.stepSizeOptions}
              value={state.numberOfBins}
            />
          )
        }

        <UiToggleSwitch
          label="Custom Palette"
          onChange={(value) => this.setState({ custom: value })}
          value={state.custom}
        />

        {
          !state.custom && (
            <ColourPaletteList
              bins={state.numberOfBins}
              items={this.itemsSelector(state)}
              onChange={props.onChange}
              value={props.value}
            />
          )
        }

        {
          state.custom && (
            <CustomColourPaletteEditor
              bins={state.numberOfBins}
              colourPalette={props.value}
              field={props.field}
              onClose={props.onMenuClose}
              onCustomPaletteCreated={props.onChange}
            />
          )
        }
    </React.Fragment>
    );
  }
}

GradientColourPalettePicker.displayName = "GradientColourPalettePicker";

GradientColourPalettePicker.propTypes = {
  onlyContinuousPalettes: PropTypes.bool,
  colourPalettes: PropTypes.arrayOf(StylePalette),
  field: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onMenuClose: PropTypes.func,
  value: StylePalette,
};

GradientColourPalettePicker.defaultProps = {
  colourPalettes: colourRanges,
};

export default GradientColourPalettePicker;
