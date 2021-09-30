import { connectToPresentState } from "../utils/state";

import Component from "../components/CustomColourPaletteEditor.react";

import { addCustomColourPalette, updateColourPalette } from "../actions/styles";

import colourMapForFieldSelector from "../selectors/styles/colour-map-for-field";

function mapStateToProps(state, { bins, field }) {
  return {
    colourMap: (field && !(bins >= 0)) ? colourMapForFieldSelector(state, field) : undefined,
  };
}

const mapDispatchToProps = (dispatch) => ({
  onAddPalette: (palette) => dispatch(addCustomColourPalette(palette)),
  onUpdatePalette: (palette) => dispatch(updateColourPalette(palette)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
