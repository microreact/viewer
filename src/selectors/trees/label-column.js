import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";

function labelColumnSelector(state, treeId) {
  const fieldsByName = dataColumnsByFieldMapSelector(state);
  return fieldsByName.get(state.trees[treeId].labelField);
}

export default labelColumnSelector;
