import { combineReducers } from "redux";
import undoable from "redux-undo";

import charts from "./charts";
import config from "./config";
import datasets from "./datasets";
import files from "./files";
import filters from "./filters";
import maps from "./maps";
import meta from "./meta";
import networks from "./networks";
import notes from "./notes";
import panes from "./panes";
import slicers from "./slicers";
import styles from "./styles";
import tables from "./tables";
import timelines from "./timelines";
import trees from "./trees";
import views from "./views";

const combinedReducer = combineReducers({
  charts,
  config,
  datasets,
  files,
  filters,
  maps,
  meta,
  networks,
  notes,
  panes,
  slicers,
  styles,
  tables,
  timelines,
  trees,
  views,
});

function rootReducer(state = {}, action) {
  let nextState = state;
  if (action.type === "MICROREACT VIEWER/BATCH") {
    nextState = action.payload.reduce(combinedReducer, state);
  }
  else {
    nextState = combinedReducer(state, action);
  }

  const label = action.label || (state.config ? state.config.label : undefined);
  if (label !== nextState.config.label) {
    nextState.config = { ...nextState.config };
    nextState.config.label = label;
  }

  if (action.type.startsWith("MICROREACT VIEWER/") && action.savable !== false && !nextState.config.isDirty) {
    nextState.config = { ...nextState.config };
    nextState.config.isDirty = true;
  }

  return nextState;
}

const undoableReducer = undoable(
  rootReducer,
  {
    limit: 10,
    ignoreInitialState: true,
    filter(action, currentState, previousHistory) {
      return !!action.label;
    },
    groupBy(action, currentState, previousHistory) {
      return action.group ?? null;
    },
  },
);

export default function (state, action) {

  let currentState = state;
  if (action.type === "MICROREACT VIEWER/UNLOAD") {
    currentState = undefined;
  }

  const nextState = undoableReducer(currentState, action);

  if (action.type.startsWith("@@redux-undo/")) {
    let nextPanes = {};
    if (nextState.present.panes.model) {
      nextPanes = {
        model: {
          ...(nextState.present?.panes?.model || {}),
          borders: [
            {
              ...nextState.present.panes.model.borders[0],
              selected: state.present.panes.model.borders[0].selected,
            },
          ],
        },
      };
    }
    return {
      ...nextState,
      present: {
        ...nextState.present,
        panes: {
          ...nextState.present.panes,
          ...nextPanes,
        },
      },
    };
  }

  return nextState;
}
