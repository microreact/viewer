
import mrTheme from "cgps-stdlib/themes/mr.js";

export default {
  colour: "transparent",

  fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",

  highlight: {
    colour: "#3C7383",
    width: 4,
  },

  maps: {
    style: "light",
  },

  shape: "circle",

  stroke: {
    colour: "#222",
    width: 1,
  },

  theme: mrTheme,

  validFileExtensions: [
    { kind: "data", extension: "csv" },
    { kind: "data", extension: "xlsx" },
    { kind: "data", extension: "xls" },
    { kind: "data", extension: "ods" },
    { kind: "data", extension: "tsv" },
    { kind: "tree", extension: "nwk" },
    { kind: "tree", extension: "newick" },
    { kind: "tree", extension: "tre" },
    { kind: "tree", extension: "nex" },
    { kind: "tree", extension: "nexus" },
    { kind: "tree", extension: "nhx" },
    { kind: "network", extension: "dot" },
    { kind: "geo", extension: "geojson" },
    { kind: "microreact", extension: "microreact" },
  ],

  DELAY: 64,
  SHAPE: "circle",
  PATTERN: "solid",
  COLOUR: "#555555",
  COLOUR_DARK: "#383838",
  LABEL_COLOUR: "#2A2A2A",
  TREE_TYPE: "radial",
  LAYOUT: {
    MINIMUM_CONTAINER_WIDTH: 150,
    MINIMUM_CONTAINER_HEIGHT: 50,
  },
  HIGHLIGHT_COLOUR: "#3C7383",
  HIGHLIGHT_WIDTH: 4,
  MAP: {
    CENTER: {
      LATITUDE: 47.34452036,
      LONGITUDE: 5.85082183,
    },
    ZOOM: 4,
  },
  MIN_WIDTH: 240,
  MIN_HEIGHT: 160,
  NODE_RADIUS: 7,
  COMPONENTS: {
    LEGEND: "Legend",
    MAP: "Map",
    NETWORK: "Network",
    SEARCH: "Search",
    TABLE: "Table",
    TIMELINE: "Timeline",
    TREE: "Tree",
  },
  THEME: {
    COLOURS: {
      GREEN: "#3C7383",
      LIGHT_GREEN: "#9BB7BF",
    },
    ICONS: {
      MAP: "language",
      TREE: "nature",
      NETWORK: "device_hub",
      TIMELINE: "access_time",
      LEGEND: "map",
      SHARE: "share",
      TABLE: "grid_on",
    },
  },
};
