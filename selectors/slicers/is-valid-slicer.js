import slicerStateSelector from "./slicer-state";

function isValidSlicerSelector(state, slicerId) {
  const slicerState = slicerStateSelector(state, slicerId);
  return slicerState.field;
}

export default isValidSlicerSelector;
