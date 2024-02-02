import { combineReducers } from "redux";
import undoable from "redux-undo";

import charts from "./charts.js";
import config from "./config.js";
import datasets from "./datasets.js";
import files from "./files.js";
import filters from "./filters.js";
import matrices from "./matrices.js";
import maps from "./maps.js";
import meta from "./meta.js";
import networks from "./networks.js";
import notes from "./notes.js";
import panes from "./panes.js";
import slicers from "./slicers.js";
import styles from "./styles.js";
import tables from "./tables.js";
import timelines from "./timelines.js";
import trees from "./trees.js";
import views from "./views.js";

const combinedReducer = combineReducers({
  charts,
  config,
  datasets,
  files,
  filters,
  matrices,
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
