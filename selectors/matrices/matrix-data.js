import fileContentSelector from "../files/file-content.js";
import matrixStateSelector from "./matrix-state.js";

function matrixDataSelector(state, matrixId) {
  return fileContentSelector(
    state,
    matrixStateSelector(state, matrixId)?.file,
  );
}

export default matrixDataSelector;
