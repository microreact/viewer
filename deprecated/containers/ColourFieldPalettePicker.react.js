import coloursDataColumnSelector from "../selectors/styles/colours-data-column";
import colourPalettesSelector from "../selectors/styles/colour-palettes";

import ColourFieldPalettePicker from "../components/ColourFieldPalettePicker.react";
import { connectToPresentState } from "../utils/state";
import colourMapForFieldSelector from "../selectors/styles/colour-map-for-field";

const mapStateToProps = (state) => {
  const colourByDataField = coloursDataColumnSelector(state);
  return {
    colourPalettes: colourPalettesSelector(state),
    valueToColourMap: colourMapForFieldSelector(state, colourByDataField.name),
  };
};

const mapDispatchToProps = (dispatch) => ({
});

export default connectToPresentState(ColourFieldPalettePicker, mapStateToProps, mapDispatchToProps);
