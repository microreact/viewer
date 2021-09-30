import { emptyArray, emptyObject } from "../constants";
import * as Arrays from "../utils/arrays";

const initialState = {
  dataFilters: [],
  searchOperator: "includes",
  searchValue: "",
  selection: emptyArray,
  selectionBreakdownField: null,
};

function addRowsToSelection(state, payload) {
  const selectedids = state.selection || emptyArray;
  const merge = payload.merge || false;

  if (payload.ids) {
    if (merge) {
      const newHighlightedId = new Set(selectedids);

      for (const id of payload.ids) {
        if (newHighlightedId.has(id)) {
          newHighlightedId.delete(id);
        } else {
          newHighlightedId.add(id);
        }
      }

      return {
        ...state,
        selection: Array.from(newHighlightedId),
      };
    }

    if (!merge) {
      return {
        ...state,
        selection: Array.from(payload.ids),
      };
    }
  }

  if (merge === false && state.selection !== emptyArray) {
    return {
      ...state,
      selection: emptyArray,
    };
  }

  return state;
}

function applyQueryToState(currentState, query) {
  if (query.dfc || query.dfr) {
    const nextState = {
      ...currentState,
      dataFilters: [
        ...(currentState.dataFilters || []),
      ],
    };

    if (query.dfr === "*") {
      nextState.dataFilters = [];
    }
    else if (query.dfr) {
      Arrays.remove(
        nextState.dataFilters,
        (x) => x.field === query.dfr,
        false,
      );
    }

    if (query.dfc && query.dfo && query.dfv) {
      Arrays.remove(
        nextState.dataFilters,
        (x) => x.field === query.dfc,
        false,
      );
      nextState.dataFilters.push({
        field: query.dfc,
        operator: query.dfo,
        value: [ query.dfv ],
      });
    }

    return nextState;
  }

  return currentState;
}

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case "MICROREACT VIEWER/LOAD": {
      // const queryState = mapQueryToProps(queryPropMap, action.payload.query);
      // for (const key of Object.keys(queryState)) {
      //   if (Array.isArray(queryState[key])) {
      //     queryState[key] = queryState[key].map((x) => x.toLowerCase());
      //   }
      //   else if (typeof queryState[key] === "string") {
      //     queryState[key] = queryState[key].toLowerCase();
      //   }
      // }
      const nextState = {
        ...initialState,
        ...(action.payload.filters || emptyObject),
      };
      if (action.payload?.query) {
        return applyQueryToState(nextState, action.payload.query);
      }
      else {
        return nextState;
      }
    }

    case "MICROREACT VIEWER/QUERY": {
      return applyQueryToState(state, action.payload);
    }

    case "MICROREACT VIEWER/RESET ALL FILTERS": {
      return {
        ...state,
        dataFilters: initialState.dataFilters,
        searchValue: initialState.searchValue,
        selection: initialState.selection,
      };
    }

    case "MICROREACT VIEWER/RESET TABLE FILTERS": {
      return {
        ...state,
        dataFilters: initialState.dataFilters,
      };
    }

    case "MICROREACT VIEWER/SELECT ROWS": {
      return addRowsToSelection(state, action.payload);
    }

    case "MICROREACT VIEWER/SET FIELD FILTER": {
      const dataFilters = [ ...state.dataFilters ];
      let index = dataFilters.findIndex((x) => x.field === action.payload.field);
      if (index < 0) {
        dataFilters.push({ field: action.payload.field });
        index = dataFilters.length - 1;
      }
      if (action.payload.operator) {
        dataFilters[index] = {
          ...dataFilters[index],
          operator: action.payload.operator,
          value: action.payload.value,
        };
      }
      else {
        dataFilters.splice(index, 1);
      }
      return {
        ...state,
        dataFilters,
      };
    }

    case "MICROREACT VIEWER/SET SEARCH OPERATOR": {
      return {
        ...state,
        searchOperator: action.payload,
      };
    }

    case "MICROREACT VIEWER/SET SEARCH VALUE": {
      return {
        ...state,
        searchValue: action.payload,
      };
    }

    case "MICROREACT VIEWER/SET SELECTION BREAKDOWN FIELD": {
      return {
        ...state,
        selectionBreakdownField: action.payload,
      };
    }

    default:
      return state;
  }
};

export default reducer;
