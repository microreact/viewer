import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";
import slicerStateSelector from "./slicer-state";

function dataColumnSelector(state, slicerId) {
  const fieldsMap = dataColumnsByFieldMapSelector(state);
  const { field } = slicerStateSelector(state, slicerId);
  if (field) {
    return fieldsMap.get(field);
  }
  else {
    return undefined;
  }
}

export default dataColumnSelector;
