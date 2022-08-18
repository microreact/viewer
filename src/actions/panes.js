/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */

import layoutModelSelector from "../selectors/panes/layout-model";
import { removeTabFromModel, selectBorderTab } from "../utils/panes";
import { getPresentState, newId } from "../utils/state";

import { addChart, removeChart } from "./charts";
import { addMap, removeMap } from "./maps";
import { addNetwork, removeNetwork } from "./networks";
import { addNote, removeNote } from "./notes";
import { addTable, removeTable } from "./tables";
import { addTimeline, removeTimeline } from "./timelines";
import { addTree, removeTree } from "./trees";
import { addSlicer, removeSlicer } from "./slicers";

export function addView(componentName) {
  return (dispatch, getState) => {
    const state = getPresentState(getState());

    switch (componentName) {
      case "Chart": {
        const paneId = newId(state.charts, "chart");
        return dispatch(addChart(paneId));
      }

      case "Map": {
        const paneId = newId(state.maps, "map");
        return dispatch(addMap(paneId));
      }

      case "Network": {
        const paneId = newId(state.networks, "network");
        return dispatch(addNetwork(paneId));
      }

      case "Note": {
        const paneId = newId(state.notes, "note");
        return dispatch(addNote(paneId));
      }

      case "Slicer": {
        const paneId = newId(state.slicers, "slicer");
        return dispatch(addSlicer(paneId));
      }

      case "Table": {
        const paneId = newId(state.tables, "table");
        return dispatch(addTable(paneId));
      }

      case "Timeline": {
        const paneId = newId(state.timelines, "timeline");
        return dispatch(addTimeline(paneId));
      }

      case "Tree": {
        const paneId = newId(state.trees, "tree");
        return dispatch(addTree(paneId));
      }
    }
  };
}

export function removePane(paneId) {
  return (dispatch, getState) => {
    const state = getPresentState(getState());
    const layoutModel = layoutModelSelector(state);
    const newModel = removeTabFromModel(layoutModel, paneId);
    // const updateLayoutModelAction = setLayoutModel(newModel);
    // updateLayoutModelAction.group = `${paneId}/remove`;

    const node = layoutModel.getNodeById(paneId);
    switch (node._attributes.component) {
      case "Chart": {
        dispatch(removeChart(paneId));
        break;
      }

      case "Map": {
        dispatch(removeMap(paneId));
        break;
      }

      case "Network": {
        dispatch(removeNetwork(paneId));
        break;
      }

      case "Note": {
        dispatch(removeNote(paneId));
        break;
      }

      case "Slicer": {
        dispatch(removeSlicer(paneId));
        break;
      }

      case "Table": {
        dispatch(removeTable(paneId));
        break;
      }

      case "Timeline": {
        dispatch(removeTimeline(paneId));
        break;
      }

      case "Tree": {
        dispatch(removeTree(paneId));
        break;
      }
    }

    dispatch(
      setLayoutModel(newModel)
    );
  };
}

export function setLayoutModel(model) {
  return {
    delay: true,
    group: "layout model",
    label: model.actionLabel ? `Layout: ${model.actionLabel}` : undefined,
    payload: model.toJson(),
    savable: false,
    type: "MICROREACT VIEWER/SET LAYOUT MODEL",
  };
}

export function setSidePane(sidePane = null) {
  return (dispatch, getState) => {
    const state = getPresentState(getState());
    const layoutModel = layoutModelSelector(state);
    const newModel = selectBorderTab(layoutModel, sidePane);
    dispatch(
      setLayoutModel(newModel)
    );
  };
}
