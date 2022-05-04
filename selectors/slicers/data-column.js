import dataColumnByFieldSelector from "../datasets/data-column-by-field";
import slicerStateSelector from "./slicer-state";

function dataColumnSelector(state, slicerId) {
  const slicerState = slicerStateSelector(state, slicerId);
  return dataColumnByFieldSelector(
    state,
    slicerState.dataField || slicerState.field,
  );
}

export default dataColumnSelector;
