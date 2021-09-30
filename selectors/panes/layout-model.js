import { createSelector } from "reselect";
import FlexLayout from "flexlayout-react";
import { relayoutModel } from "../../utils/panes";

const borders = [
  {
    type: "border",
    size: 240,
    location: "right",
    children: [
      {
        id: "--mr-legend-pane",
        type: "tab",
        name: "Legend",
        component: "Legend",
        enableClose: false,
        enableDrag: false,
      },
      {
        id: "--mr-selection-pane",
        type: "tab",
        name: "Selection",
        component: "Selection",
        enableClose: false,
        enableDrag: false,
      },
      {
        id: "--mr-history-pane",
        type: "tab",
        name: "History",
        component: "History",
        enableClose: false,
        enableDrag: false,
      },
      {
        id: "--mr-views-pane",
        type: "tab",
        name: "Views",
        component: "Views",
        enableClose: false,
        enableDrag: false,
      },
    ],
  },
];

const global = {
  borderBarSize: 20,
  borderEnableDrop: false,
  borderMinSize: 160,
  splitterSize: 2,
  tabEnableClose: false,
  tabEnableFloat: false,
  tabSetHeaderHeight: 1,
  tabSetMinHeight: 160,
  tabSetMinWidth: 160,
  tabSetTabStripHeight: 1,
};

const defaultLayoutSelector = createSelector(
  (state) => state.charts,
  (state) => state.maps,
  (state) => state.networks,
  (state) => state.notes,
  (state) => state.tables,
  (state) => state.timelines,
  (state) => state.trees,
  (state) => state.slicers,
  (
    charts,
    maps,
    networks,
    notes,
    tables,
    timelines,
    trees,
    slicers,
  ) => {
    let leftPanes = null;
    const topPanes = [];

    const slicerIds = Object.keys(slicers);
    if (slicerIds.length) {
      topPanes.push({
        type: "tabset",
        weight: 16,
        children: slicerIds.map(
          (slicerId) => ({
            id: slicerId,
            type: "tab",
            name: slicers[slicerId].title,
            component: "Slicer",
          })
        ),
      });
    }

    const noteIds = Object.keys(notes);
    if (noteIds.length) {
      leftPanes = {
        type: "tabset",
        weight: 16,
        children: noteIds.map(
          (noteId) => ({
            id: noteId,
            type: "tab",
            name: notes[noteId].title,
            component: "Note",
          })
        ),
      };
    }

    const mapIds = Object.keys(maps);
    if (mapIds.length) {
      topPanes.push({
        type: "tabset",
        children: mapIds.map(
          (mapId) => ({
            id: mapId,
            type: "tab",
            name: maps[mapId].title,
            component: "Map",
            // config: { mapId },
          })
        ),
      });
    }

    const networkIds = Object.keys(networks);
    if (networkIds.length) {
      topPanes.push({
        type: "tabset",
        children: networkIds.map(
          (networkId) => ({
            id: networkId,
            type: "tab",
            name: networks[networkId].title,
            component: "Network",
            // config: { networkId },
          })
        ),
      });
    }

    const chartIds = Object.keys(charts);
    if (chartIds.length) {
      topPanes.push({
        type: "tabset",
        children: chartIds.map(
          (chartId) => ({
            id: chartId,
            type: "tab",
            name: charts[chartId].title,
            component: "Chart",
            // config: { chartId },
          })
        ),
      });
    }

    const treeIds = Object.keys(trees);
    if (treeIds.length) {
      topPanes.push({
        type: "tabset",
        children: treeIds.map(
          (treeId) => ({
            id: treeId,
            type: "tab",
            name: trees[treeId].title,
            component: "Tree",
            // config: { treeId },
          })
        ),
      });
    }

    const bottomPanes = [];

    const timelineIds = Object.keys(timelines);
    if (timelineIds.length) {
      Array.prototype.push.apply(
        bottomPanes,
        timelineIds.map(
          (timelineId) => ({
            id: timelineId,
            type: "tab",
            name: timelines[timelineId].title,
            component: "Timeline",
            // config: { timelineId },
          })
        )
      );
    }

    const tableIds = Object.keys(tables);
    if (tableIds.length) {
      Array.prototype.push.apply(
        bottomPanes,
        tableIds.map(
          (tableId) => ({
            id: tableId,
            type: "tab",
            name: tables[tableId].title,
            component: "Table",
            // config: { tableId },
          })
        )
      );
    }

    const panes = {
      type: "row",
      children: [],
    };

    if (leftPanes) {
      panes.children.push(leftPanes);
    }

    panes.children.push({
      type: "row",
      children: [
        {
          type: "row",
          weight: 64,
          children: topPanes,
        },
        {
          type: "tabset",
          weight: 48,
          children: bottomPanes,
        },
      ],
    });

    return {
      layout: panes,
    };
  },
);

const layoutModelSelector = createSelector(
  (state) => state.panes.model || defaultLayoutSelector(state),
  (
    json,
  ) => {
    if (!json.borders) {
      json.borders = borders;
    }
    json.global = global;

    const model = FlexLayout.Model.fromJson(json);

    relayoutModel(model);

    return model;
  },
);

export default layoutModelSelector;
