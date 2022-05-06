import Component from "../components/ColourSettingsContent.react";

import { setDataColumnColourPalette, setDataColumnColourField } from "../actions/styles";

import colourPaletteForFieldSelector from "../selectors/styles/colour-palette-for-field";
import colourModeForFieldSelector from "../selectors/styles/colour-mode-for-field";
import dataColumnsSelector from "../selectors/datasets/data-columns";

import { connectToPresentState } from "../utils/state";
import dataColumnByFieldSelector from "../selectors/datasets/data-column-by-field";

function mapStateToProps(state, { field }) {
  return {
    colourMode: colourModeForFieldSelector(state, field),
    colourPalette: colourPaletteForFieldSelector(state, field),
    colourSettings: state.styles.colourSettings[field],
    dataColumn: dataColumnByFieldSelector(state, field),
    dataColumns: dataColumnsSelector(state),
  };
}

function mapDispatchToProps(dispatch, { field }) {
  return {
    onDataColumnColourFieldChange: (colourAsField) => dispatch(setDataColumnColourField(field, colourAsField)),
    onDataColumnColourPaletteChange: (paletteName, colourMode) => dispatch(setDataColumnColourPalette(field, paletteName, colourMode)),
  };
}

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
