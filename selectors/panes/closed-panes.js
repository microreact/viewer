import { createSelector } from "reselect";

import layoutModelSelector from "./layout-model";

const allPaneIdsSelector = createSelector(
  (state) => state.charts,
  (state) => state.maps,
  (state) => state.networks,
  (state) => state.notes,
  (state) => state.tables,
  (state) => state.timelines,
  (state) => state.trees,
  (
    charts,
    maps,
    networks,
    notes,
    tables,
    timelines,
    trees,
  ) => {
    const panes = [];

    for (const paneId of Object.keys(notes)) {
      panes.push({
        id: paneId,
        name: notes[paneId].title,
        component: "Note",
      });
    }

    for (const paneId of Object.keys(maps)) {
      panes.push({
        id: paneId,
        name: maps[paneId].title,
        component: "Map",
      });
    }

    for (const paneId of Object.keys(networks)) {
      panes.push({
        id: paneId,
        name: networks[paneId].title,
        component: "Network",
      });
    }

    for (const paneId of Object.keys(charts)) {
      panes.push({
        id: paneId,
        name: charts[paneId].title,
        component: "Chart",
      });
    }

    for (const paneId of Object.keys(trees)) {
      panes.push({
        id: paneId,
        name: trees[paneId].title,
        component: "Tree",
      });
    }

    for (const paneId of Object.keys(timelines)) {
      panes.push({
        id: paneId,
        name: timelines[paneId].title,
        component: "Timeline",
      });
    }

    for (const paneId of Object.keys(tables)) {
      panes.push({
        id: paneId,
        name: tables[paneId].title,
        component: "Table",
      });
    }

    return panes;
  },
);

const closedPanesSelector = createSelector(
  (state) => allPaneIdsSelector(state),
  (state) => layoutModelSelector(state),
  (
    allPaneIds,
    model,
  ) => {
    const closed = [];

    for (const pane of allPaneIds) {
      if (!(pane.id in model._idMap)) {
        closed.push(pane);
      }
    }

    return closed;
  },
);

export default closedPanesSelector;
