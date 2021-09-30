import fileDescriptorSelector from "../files/file-descriptor";
import treeStateSelector from "./tree-state";

function treeFileSelector(state, treeId) {
  return fileDescriptorSelector(
    state,
    treeStateSelector(state, treeId)?.file,
  );
}

export default treeFileSelector;
