import { createKeyedStateSelector } from "../../utils/state";

import colourMapForFieldSelector from "../styles/colour-map-for-field";

import seriesFieldSelector from "./series-field";
import rowsSelector from "../datasets/rows";
import filteredIdsSelector from "../filters/filtered-ids";
import configSelector from "../config.js";

const seriesValueToColourMapSelector = (state, chartId) => {
  const seriesDataColumn = seriesFieldSelector(state, chartId);
  if (seriesDataColumn) {
    return colourMapForFieldSelector(state, seriesDataColumn.name);
  }
  else {
    return undefined;
  }
};

const seriesScaleSelector = createKeyedStateSelector(
  (state, chartId) => seriesFieldSelector(state, chartId),
  (state) => rowsSelector(state),
  (state) => filteredIdsSelector(state),
  (state, chartId) => seriesValueToColourMapSelector(state, chartId),
  (state) => state.styles.defaultColour,
  (state) => configSelector(state).theme.primary.main,
  (
    seriesDataColumn,
    rows,
    filteredIds,
    seriesValueToColourMap,
    defaultColour,
    defaultColourRange,
  ) => {
    if (!seriesDataColumn) {
      return null;
    }

    const uniqueValues = new Set();
    for (const row of rows) {
      if (!filteredIds || filteredIds.has(row[0])) {
        const value = row[seriesDataColumn.name];
        uniqueValues.add(value);
      }
    }
    const uniqueSeriesValues = Array.from(uniqueValues).sort();

    let colours = defaultColourRange;
    if (seriesValueToColourMap) {
      colours = [];
      for (const value of uniqueSeriesValues) {
        colours.push(seriesValueToColourMap.get(value) ?? defaultColour);
      }
      colours = Array.from(colours);

    }

    return {
      domain: uniqueSeriesValues,
      range: colours,
    };
  },
);

export default seriesScaleSelector;
