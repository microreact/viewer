import { remove, update } from "../utils/arrays";

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case "MICROREACT VIEWER/ADD VIEW": {
      return [
        (action.payload || {}),
        ...state,
      ];
    }

    case "MICROREACT VIEWER/DELETE VIEW": {
      return remove(
        state,
        (item) => item.meta.id === action.payload.meta.id,
      );
    }

    case "MICROREACT VIEWER/LOAD": {
      return action.payload.views || initialState;
    }

    case "MICROREACT VIEWER/SET VIEWS LIST": {
      return action.payload;
    }

    case "MICROREACT VIEWER/UPDATE VIEW": {
      return update(
        state,
        (item) => item.meta.id === action.payload.meta.id,
        action.payload,
      );
    }

    case "MICROREACT VIEWER/SET DEFAULT VIEW": {
      return update(
        remove(
          state,
          (item) => item.isDefault,
          { isDefault: false },
        ),
        (item) => item.meta.id === action.payload.meta.id,
        { isDefault: true },
      );
    }

    default: {
      return state;
    }
  }
};
