const initialState = {
  pending: undefined,
  paneEditor: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "MICROREACT VIEWER/LOAD": {
      const nextState = {
        ...initialState,
        config: {
          ...(state.config || {}),
          ...(action.payload.config || {}),
        },
      };
      if (action.payload?.query?.ui === "edit") {
        nextState.paneEditor = { mode: "edit" };
      }
      return nextState;
    }

    case "MICROREACT VIEWER/CONFIG": {
      return {
        ...initialState,
        config: action.payload || {},
      };
    }

    case "MICROREACT VIEWER/PROCESS FILE": {
      const fileIndex = state.pending.findIndex((x) => x.id === action.payload.file);
      const pending = [ ...state.pending ];
      pending[fileIndex] = {
        ...pending[fileIndex],
        ...action.payload.settings,
        proccessed: true,
      };
      return {
        ...state,
        pending,
      };
    }

    case "MICROREACT VIEWER/UPDATE UI": {
      return {
        ...state,
        ...action.payload,
      };
    }

    default: {
      return state;
    }
  }
};
