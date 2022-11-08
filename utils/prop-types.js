// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";

// function createEnumType(items) {
//   const type = PropTypes.oneOf(items);
//   for (const item of items) {
//     type[item] = type
//   }
// }

export const ChartTypes = PropTypes.oneOf([
  "area",
  "bar",
  "circle",
  "custom",
  "heatmap",
  "line",
  "point",
  "tick",
]);

export const ChartAxisMode = PropTypes.oneOf([
  "field",
  "frequency",
  "cumulative-frequency",
  "sum-of",
  "cumulative-sum-of",
  "average-of",
]);
ChartAxisMode.FIELD = "field";

export const ChartDataTable = PropTypes.shape({
  table: PropTypes.arrayOf(
    PropTypes.object.isRequired,
  ).isRequired,
});

export const ColourModes = PropTypes.oneOf([
  "categorical",
  "field",
  "gradient",
]);

export const DataColumn = PropTypes.shape({
  dataType: PropTypes.string.isRequired,
  isNumeric: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

export const DataFilter = PropTypes.shape({
  operator: PropTypes.string,
  value: PropTypes.any,
});

export const FileDescriptor = PropTypes.shape({
  id: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  name: PropTypes.string,
  url: PropTypes.string,
  blob: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Blob),
  ]),
});

export const FileKind = PropTypes.oneOf([
  "microreact",
  "data",
  "geo",
  "network",
  "tree",
]);
export const FileExtension = PropTypes.shape({
  kind: FileKind.isRequired,
  extension: PropTypes.string.isRequired,
});

export const HistoryEntry = PropTypes.shape({
  index: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  image: PropTypes.string,
});

export const GeometricPoint = PropTypes.arrayOf(
  PropTypes.number.isRequired,
);

export const LabelValuePair = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
});

export const MapLocation = PropTypes.arrayOf(PropTypes.number.isRequired);

export const MapMarker = PropTypes.shape({
  maxx: PropTypes.number,
  maxy: PropTypes.number,
  minx: PropTypes.number,
  miny: PropTypes.number,
  position: MapLocation.isRequired,
  rows: PropTypes.array.isRequired,
  style: PropTypes.shape({
    colour: PropTypes.string.isRequired,
    label: PropTypes.any,
    shape: PropTypes.string.isRequired,
  }),
  slices: PropTypes.arrayOf(PropTypes.array),
});

export const MapboxStyle = PropTypes.oneOfType([
  PropTypes.string.isRequired,
  PropTypes.object.isRequired,
]);

export const ReactRef = PropTypes.shape({ current: PropTypes.object });

export const StylePalette = PropTypes.shape({
  entries: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.array.isRequired,
      PropTypes.string.isRequired,
    ])
  ).isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
});

export const TableColumn = PropTypes.shape({
  align: PropTypes.oneOf([
    "right",
    "left",
  ]),
  dataKey: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  frozen: PropTypes.oneOf([
    true,
    false,
    "right",
    "left",
  ]),
  hidden: PropTypes.bool.isRequired,
  key: PropTypes.string.isRequired,
  minWidth: PropTypes.number.isRequired,
  resizable: PropTypes.bool.isRequired,
  sort: PropTypes.oneOf([
    "asc",
    "desc",
  ]),
  sortable: PropTypes.bool.isRequired,
  tableId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
});

export const ThemeDef = PropTypes.shape({
  background: PropTypes.shape({
    main: PropTypes.string.isRequired,
    highlight: PropTypes.string.isRequired,
    hover: PropTypes.string.isRequired,
    disabled: PropTypes.string.isRequired,
    // paper: PropTypes.string.isRequired,
    // default: PropTypes.string.isRequired,
  }).isRequired,
  text: PropTypes.shape({
    primary: PropTypes.string.isRequired,
    secondary: PropTypes.string.isRequired,
    disabled: PropTypes.string.isRequired,
    hint: PropTypes.string.isRequired,
  }).isRequired,
  primary: PropTypes.shape({
    light: PropTypes.string.isRequired,
    main: PropTypes.string.isRequired,
    dark: PropTypes.string.isRequired,
    contrast: PropTypes.string.isRequired,
  }).isRequired,
  secondary: PropTypes.shape({
    light: PropTypes.string.isRequired,
    main: PropTypes.string.isRequired,
    dark: PropTypes.string.isRequired,
    contrast: PropTypes.string.isRequired,
  }).isRequired,
});

export const TreeType = PropTypes.oneOf([
  "rc",
  "cr",
  "rd",
  "dg",
  "hr",
]);
