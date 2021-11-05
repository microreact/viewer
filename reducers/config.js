import { emptyObject } from "../constants";
import defaults from "../defaults";

const initialState = {
  editor: null,
  isBuzy: false,
  isDirty: false,
  mapboxApiAccessToken: null,
  pendingFiles: null,
  readOnly: false,
  theme: null,
  ...defaults,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "MICROREACT VIEWER/LOAD": {
      const nextState = {
        ...state,
        ...(action.payload.config || emptyObject),
        editor: initialState.editor,
        isBuzy: initialState.isBuzy,
        isDirty: initialState.isDirty,
      };
      if (action.payload?.query?.ui === "edit") {
        nextState.editor = { mode: "edit" };
      }
      return nextState;
    }

    case "MICROREACT VIEWER/CONFIG": {
      return {
        ...state,
        ...(action.payload || emptyObject),
      };
    }

    default: {
      return state;
    }
  }
};
