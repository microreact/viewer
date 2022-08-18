import { replaceKeyedState, removeKeyedState } from "../utils/state";
import { normaliseFilename } from "../utils/files";

const initialState = {
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "MICROREACT VIEWER/ADD FILE": {
      return {
        ...state,
        [action.payload.id]: {
          _content: action.payload._content,
          blob: action.payload.blob,
          format: action.payload.format,
          hash: action.payload.hash,
          id: action.payload.id,
          name: normaliseFilename(action.payload.name),
          size: action.payload.size,
          type: action.payload.type,
          url: action.payload.url,
        },
      };
    }

    case "MICROREACT VIEWER/LOAD": {
      const files = {};
      if (action.payload.files) {
        for (const [ key, file ] of Object.entries(action.payload.files)) {
          files[key] = {
            _content: file._content,
            blob: file.blob,
            format: file.format,
            hash: file.hash,
            id: key,
            name: normaliseFilename(file.name),
            size: file.size,
            type: file.type,
            url: file.url,
          };
        }
      }
      return files;
    }

    case "MICROREACT VIEWER/REMOVE FILE": {
      return removeKeyedState(state, action.payload);
    }

    case "MICROREACT VIEWER/REMOVE TREE":
    case "MICROREACT VIEWER/REMOVE NETWORK":
    case "MICROREACT VIEWER/REMOVE MAP": {
      if (action.payload.fileId) {
        return removeKeyedState(
          state,
          action.payload.fileId,
        );
      }
      else {
        return state;
      }
    }

    case "MICROREACT VIEWER/UPDATE FILE": {
      return replaceKeyedState(state, action.payload.id, action.payload);
    }

    default:
      return state;
  }
};

export default reducer;
