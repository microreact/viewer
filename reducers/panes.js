const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case "MICROREACT VIEWER/LOAD": {
      let model;
      if (action.payload?.panes?.model) {
        model = action.payload.panes.model;
        if (
          model.borders
          &&
          (
            model.borders[0].children.some((x) => x.component === "Styles")
            ||
            model.borders[0].children.length !== 4
          )
        ) {
          model.borders = null;
        }
      }
      return {
        ...initialState,
        ...action.payload.panes,
        model,
      };
    }

    case "MICROREACT VIEWER/SET LAYOUT MODEL": {
      return {
        ...state,
        model: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
