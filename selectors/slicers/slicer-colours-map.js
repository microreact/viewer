import dataColumnSelector from "./data-column";
import slicerStateSelector from "./slicer-state";
import colourMapForFieldSelector from "../styles/colour-map-for-field";

function slicerColoursMapSelector(state, slicerId) {
  const dataColumn = dataColumnSelector(state, slicerId);

  if (dataColumn) {
    const slicerState = slicerStateSelector(state, slicerId);

    if (slicerState.colourMode === "data") {
      return colourMapForFieldSelector(
        state,
        dataColumn.name,
      );
    }

    if (slicerState.colourMode === "group" && slicerState.groupField) {
      return colourMapForFieldSelector(
        state,
        slicerState.groupField,
      );
    }
  }

  return undefined;
}

export default slicerColoursMapSelector;
