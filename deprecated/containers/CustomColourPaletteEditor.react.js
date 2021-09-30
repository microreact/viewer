import { connectToPresentState } from "../utils/state";

import Component from "../components/CustomColourPaletteEditor.react";

import { addCustomColourPalette, updateColourPalette } from "../actions/styles";
import { closePaletteEditor } from "../actions/ui";

import colourMapForFieldSelector from "../selectors/styles/colour-map-for-field";
import dataColumnByFieldSelector from "../selectors/datasets/data-column-by-field";

function mapStateToProps(state, { field }) {
  return {
    mode: state.ui.paletteEditor?.mode,
    colourMap: colourMapForFieldSelector(state, field),
    dataColumn: dataColumnByFieldSelector(state, field),
  };
}

const mapDispatchToProps = (dispatch) => ({
  onAddPalette: (palette, field) => dispatch(addCustomColourPalette(palette, field)),
  onUpdatePalette: (palette) => dispatch(updateColourPalette(palette)),
  onClose: () => dispatch(closePaletteEditor()),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
