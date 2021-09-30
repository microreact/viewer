import treeStateSelector from "./tree-state";

function isValidTreeSelector(state, treeId) {
  const treeState = treeStateSelector(state, treeId);
  return treeState.file && treeState.labelField;
}

export default isValidTreeSelector;
