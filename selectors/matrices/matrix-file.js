import fileDescriptorSelector from "../files/file-descriptor.js";
import matrixStateSelector from "./matrix-state.js";

function matrixFileSelector(state, matrixId) {
  return fileDescriptorSelector(
    state,
    matrixStateSelector(state, matrixId)?.file,
  );
}

export default matrixFileSelector;
