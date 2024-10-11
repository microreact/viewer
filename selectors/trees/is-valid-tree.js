import treeStateSelector from "./tree-state";

function isValidTreeSelector(state, treeId) {
  const treeState = treeStateSelector(state, treeId);
  if (!treeState) {
    return false
  }
  return treeState.file && treeState.labelField;
}

export default isValidTreeSelector;
