const initialState = {
  name: "Unnamed Project",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "MICROREACT VIEWER/LOAD": {
      return {
        ...initialState,
        ...action.payload.meta,
      };
    }

    case "MICROREACT VIEWER/UPDATE META": {
      return {
        ...initialState,
        ...action.payload,
      };
    }

    default:
      return state;
  }
};

export default reducer;
