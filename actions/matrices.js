import matrixStateSelector from "../selectors/matrices/matrix-state.js";
import { getPresentState } from "../utils/state.js";

export function addMatrix(paneId, title, file) {
  return {
    type: "MICROREACT VIEWER/ADD MATRIX",
    payload: {
      paneId,
      title,
      file,
    },
  };
}

export function removeMatrix(paneId) {
  return (dispatch, getState) => {
    const state = getPresentState(getState());
    const networkState = matrixStateSelector(state, paneId);
    dispatch({
      delay: true,
      group: `${paneId}/remove`,
      label: "Matrix: Remove MATRIX",
      payload: {
        paneId,
        fileId: networkState.file,
      },
      type: "MICROREACT VIEWER/REMOVE NETWORK",
    });
  };
}

export function updateMatrix(paneId, key, value) {
  return {
    delay: true,
    group: `${paneId}/${key}`,
    label: undefined,
    type: "MICROREACT VIEWER/UPDATE MATRIX",
    matrixId: paneId,
    payload: { [key]: value },
  };
}
