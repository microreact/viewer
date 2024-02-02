import { newId, removeKeyedState, updateKeyedState } from "../utils/state";

export const initialState = {
  controls: true,
};

// eslint-disable-next-line default-param-last
export default function (state = {}, action) {
  switch (action.type) {

    case "MICROREACT VIEWER/ADD MATRIX": {
      const matrixId = action.payload.matrixId || newId(state, "matrix");
      return {
        ...state,
        [matrixId]: {
          ...initialState,
          title: action.payload.title,
          ...action.payload,
        },
      };
    }

    case "MICROREACT VIEWER/LOAD": {
      const matrices = {};
      for (const matrixId of Object.keys(action.payload.matrices || {})) {
        matrices[matrixId] = {
          ...initialState,
          ...action.payload.matrices[matrixId],
        };
      }
      return matrices;
    }

    case "MICROREACT VIEWER/REMOVE MATRIX": {
      return removeKeyedState(
        state,
        action.payload.paneId,
      );
    }

    case "MICROREACT VIEWER/UPDATE MATRIX": {
      return updateKeyedState(
        state,
        action.matrixId,
        action.payload,
      );
    }

    default:
      return state;
  }
}
