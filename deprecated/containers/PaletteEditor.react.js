import { connectToPresentState } from "../utils/state";

import Component from "../components/PaletteEditor.react";
import { addCustomColourPalette, updateColourPalette } from "../actions/styles";
import colourPaletteByIdSelector from "../selectors/styles/colour-palette-by-id";
import { closePaletteEditor } from "../actions/ui";

function mapStateToProps(state) {
  return {
    colourPalette: (state.ui.paletteEditor?.mode === "edit") ? colourPaletteByIdSelector(state, state.ui.paletteEditor.palette) : undefined,
    mode: state.ui.paletteEditor?.mode,
  };
}

const mapDispatchToProps = (dispatch) => ({
  onAddPalette: (palette) => dispatch(addCustomColourPalette(palette)),
  onUpdatePalette: (palette) => dispatch(updateColourPalette(palette)),
  onClose: () => dispatch(closePaletteEditor()),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
