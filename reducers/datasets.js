import { newId, updateKeyedState, replaceKeyedState } from "../utils/state";

const initialState = {
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "MICROREACT VIEWER/LOAD": {
      return {
        ...action.payload.datasets,
      };
    }

    case "MICROREACT VIEWER/ADD DATASET": {
      const datasetId = action.payload.datasetId || newId(state, "dataset");
      return updateKeyedState(
        state,
        datasetId,
        {
          ...initialState,
          id: datasetId,
          file: action.payload.file,
          label: action.payload.label,
          ...action.payload.options,
        },
      );
    }

    case "MICROREACT VIEWER/SET COLUMN LABEL": {
      return updateKeyedState(
        state,
        action.datasetId,
        {
          labels: replaceKeyedState(
            state.labels,
            action.payload.column,
            action.payload.label,
          ),
        },
      );
    }

    case "MICROREACT VIEWER/UPDATE DATASET": {
      return updateKeyedState(
        state,
        action.datasetId,
        action.payload,
      );
    }

    default:
      return state;
  }
};

export default reducer;
