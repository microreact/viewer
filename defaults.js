export default {
  colour: "transparent",

  fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",

  highlight: {
    colour: "#3C7383",
    width: 4,
  },

  shape: "circle",

  stroke: {
    colour: "#222",
    width: 1,
  },

  theme: {
    background: {
      main: "#ffffff",
      highlight: "#f8f9fa",
      hover: "#e8eaed",
      disabled: "rgba(0, 0, 0, 0.24)",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
    primary: {
      light: "#6ca2b3",
      main: "#3c7383",
      dark: "#024756",
      contrast: "#fff",
      // light: "#9768c0",
      // main: "#673c8f",
      // dark: "#391161",
      // contrast: "#fff",
    },
    secondary: {
      light: "#e998d8",
      main: "#b668a6",
      dark: "#853a77",
      contrast: "#000000",
    },
  },

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
    { kind: "network", extension: "dot" },
    { kind: "geo", extension: "geojson" },
    { kind: "microrect", extension: "microrect" },
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
