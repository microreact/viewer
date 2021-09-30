import { update } from "../utils/arrays";
import { generateHashId } from "../utils/hash";
import { mapQueryToProps } from "../utils/query";

const initialState = {
  coloursField: null,
  colourPalettes: [],
  defaultColour: "transparent",
  defaultShape: "circle",
  colourSettings: {},
  labelsField: null,
  legendDirection: "row",
  shapesField: null,
  shapePalettes: [],
};

const queryPropMap = {
  coloursField: { key: "cbc" },
  shapesField: { key: "sbc" },
  labelsField: { key: "lbc" },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "MICROREACT VIEWER/ADD CUSTOM COLOUR PALETTE": {
      const name = action.payload.name || `palette-${generateHashId()}`;
      return {
        ...state,
        colourPalettes: [
          ...(state.colourPalettes || []),
          {
            bins: action.payload.bins,
            entries: action.payload.entries,
            label: action.payload.label,
            name,
            type: "custom",
          },
        ],
      };
    }

    case "MICROREACT VIEWER/ADD CUSTOM SHAPE PALETTE": {
      return {
        ...state,
        shapePalettes: [
          ...(state.shapePalettes || []),
          {
            entries: action.payload.entries,
            label: action.payload.label,
            name: action.payload.name || `palette-${generateHashId()}`,
            type: "custom",
          },
        ],
      };
    }

    case "MICROREACT VIEWER/LOAD": {
      const queryProps = mapQueryToProps(queryPropMap, action.payload.query);
      return {
        ...initialState,
        ...action.payload.styles,
        ...queryProps,
      };
    }

    case "MICROREACT VIEWER/QUERY": {
      const queryState = mapQueryToProps(queryPropMap, action.payload);
      if (Object.keys(queryState)) {
        return {
          ...state,
          ...queryState,
        };
      }
      else {
        return state;
      }
    }

    case "MICROREACT VIEWER/SET COLOUR BY FIELD": {
      return {
        ...state,
        coloursField: action.payload,
      };
    }

    case "MICROREACT VIEWER/SET DEFAULT COLOUR": {
      return {
        ...state,
        defaultColour: action.payload,
      };
    }

    case "MICROREACT VIEWER/SET COLOUR SETTINGS": {
      return {
        ...state,
        colourSettings: {
          ...state.colourSettings,
          [action.payload.field]: action.payload.settings,
        },
      };
    }

    case "MICROREACT VIEWER/SET LABEL BY FIELD": {
      return {
        ...state,
        labelsField: action.payload,
      };
    }

    case "MICROREACT VIEWER/SET LEGEND DIRECTION": {
      return {
        ...state,
        legendDirection: action.payload,
      };
    }

    case "MICROREACT VIEWER/SET SHAPE BY FIELD": {
      return {
        ...state,
        shapesField: action.payload,
      };
    }

    case "MICROREACT VIEWER/UPDATE COLOUR PALETTE": {
      const colourPalettes = update(
        state.colourPalettes,
        (x) => x.name === action.payload.name,
        {
          entries: action.payload.entries,
          label: action.payload.label,
          name: action.payload.name,
          type: "custom",
        },
      );
      return {
        ...state,
        colourPalettes,
      };
    }

    default:
      return state;
  }
};

export default reducer;
