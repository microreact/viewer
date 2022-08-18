import { mapQueryToProps } from "../utils/query";
import {
  newId,
  removeKeyedState,
  // updateAll as updateAllNotes,
  updateKeyedState as updateNote,
} from "../utils/state";

export const initialState = {
  source: "",
};

const queryPropMap = {
};

export default function (state = {}, action) {
  switch (action.type) {

    case "MICROREACT VIEWER/ADD NOTE": {
      const noteId = action.payload.noteId || newId(state, "note");
      return {
        ...state,
        [noteId]: {
          ...initialState,
          title: action.payload.title,
          ...action.payload,
        },
      };
    }

    case "MICROREACT VIEWER/LOAD": {
      const notes = {};
      for (const noteId of Object.keys(action.payload.notes)) {
        notes[noteId] = {
          ...initialState,
          ...action.payload.notes[noteId],
          ...mapQueryToProps(queryPropMap, action.payload.query),
        };
      }
      return notes;
    }

    case "MICROREACT VIEWER/REMOVE NOTE": {
      return removeKeyedState(
        state,
        action.payload.paneId,
      );
    }

    case "MICROREACT VIEWER/UPDATE NOTE": {
      return updateNote(
        state,
        action.noteId,
        action.payload,
      );
    }

    default:
      return state;
  }
}
