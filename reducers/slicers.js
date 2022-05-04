import { emptyObject } from "../constants";
import { mapQueryToProps } from "../utils/query";
import {
  newId,
  removeKeyedState,
  updateKeyedState as updateSlicer,
} from "../utils/state";

export const initialState = {
  displayMode: "off",
  sortOrder: "alphabetical",
};

const queryPropMap = {
  controls: { key: "sc", type: Boolean },
};

export default function (state = {}, action) {
  switch (action.type) {

    case "MICROREACT VIEWER/ADD SLICER": {
      const slicerId = action.payload.slicerId || newId(state, "slicer");
      return {
        ...state,
        [slicerId]: {
          ...initialState,
          title: action.payload.title,
          ...action.payload,
        },
      };
    }

    case "MICROREACT VIEWER/LOAD": {
      const slicers = {};
      for (const slicerId of Object.keys(action.payload.slicers || emptyObject)) {
        slicers[slicerId] = {
          ...initialState,
          ...action.payload.slicers[slicerId],
          field: action.payload.slicers[slicerId]?.field ?? action.payload.slicers[slicerId]?.dataField,
          ...mapQueryToProps(queryPropMap, action.payload.query),
        };
      }
      return slicers;
    }

    case "MICROREACT VIEWER/REMOVE SLICER": {
      return removeKeyedState(
        state,
        action.payload.paneId,
      );
    }

    case "MICROREACT VIEWER/UPDATE SLICER": {
      return updateSlicer(
        state,
        action.slicerId,
        action.payload,
      );
    }

    default:
      return state;
  }
}
