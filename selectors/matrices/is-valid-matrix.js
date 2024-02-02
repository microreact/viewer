import matrixStateSelector from "./matrix-state.js";

function isValidMatrixSelector(state, matrixId) {
  const matrixState = matrixStateSelector(state, matrixId);
  return (
    matrixState.file
    // &&
    // matrixState.linkColumn
  );
}

export default isValidMatrixSelector;
