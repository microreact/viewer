import PropTypes from "prop-types";
import React from "react";
import { createSelector } from "reselect";

import { colourSteps, colourRanges } from "../utils/colours";
import { StylePalette } from "../utils/prop-types";
import { triggerWindowResize } from "../utils/browser";

import ColourPaletteList from "./ColourPaletteList.react";
import CustomColourPaletteEditor from "../containers/CustomColourPaletteEditor.react";
import UiSelect from "./UiSelect.react";
import UiToggleSwitch from "./UiToggleSwitch.react";

function calculateDefaultNumberOfSteps(colours) {
  if (colours >= 24) {
    return 24;
  }
  else {
    for (const step of colourSteps) {
      if (step >= colours) {
        return step;
      }
    }

    return 24;
  }
}

class CategoricalColourPalettePicker extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      paletteType: /* props?.value?.type ?? */ "all",
      paletteSize: calculateDefaultNumberOfSteps(props?.value?.entries?.length ?? 24),
      custom: (props?.value?.type === "custom" && !(props?.value?.bins >= 0)),
    };
  }

  setState(updater) {
    super.setState(
      updater,
      triggerWindowResize,
    );
  }

  itemsSelector = createSelector(
    (params) => params.paletteType,
    (params) => params.paletteSize,
    (
      paletteType,
      paletteSize,
    ) => {
      return this.props.colourPalettes.filter(
        (x) => {
          return (
            (
              paletteType === "all"
              ||
              paletteType === x.type
            )
            &&
            (
              paletteSize === x.entries.length
            )
          );
        }
      );
    }
  );

  paletteTypeOptions = [
    { value: "all" },
    { value: "diverging" },
    { value: "qualitative" },
    { value: "sequential" },
    { value: "singlehue" },
  ]

  paletteSizeOptions = colourSteps.map((value) => ({ value }))

  render() {
    const { props, state } = this;

    return (
      <React.Fragment>
        {
          !state.custom && (
            <UiSelect
              label="Palette type"
              onChange={(value) => this.setState({ paletteType: value })}
              options={this.paletteTypeOptions}
              value={state.paletteType}
            />
          )
        }

        {
          !state.custom && (
            <UiSelect
              label="Number of colours"
              onChange={(value) => this.setState({ paletteSize: value })}
              options={this.paletteSizeOptions}
              value={state.paletteSize}
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
              items={this.itemsSelector(state)}
              onChange={props.onChange}
              value={props.value}
            />
          )
        }

        {
          state.custom && (
            <CustomColourPaletteEditor
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

CategoricalColourPalettePicker.displayName = "CategoricalColourPalettePicker";

CategoricalColourPalettePicker.propTypes = {
  colourPalettes: PropTypes.arrayOf(StylePalette),
  field: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onMenuClose: PropTypes.func.isRequired,
  value: StylePalette,
};

CategoricalColourPalettePicker.defaultProps = {
  colourPalettes: colourRanges,
};

export default CategoricalColourPalettePicker;
