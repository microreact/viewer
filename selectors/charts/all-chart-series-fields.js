import { emptyArray } from "../../constants";
import { createCombinedStateSelector } from "../../utils/state";

import chartStateSelector from "./chart-state";

const allChartsSeriesFieldsSelector = createCombinedStateSelector(
  (state) => state.charts,
  (state, chartId) => chartStateSelector(state, chartId).seriesField,
  (fields) => {
    return Array.from(new Set(fields || emptyArray));
  },
);

export default allChartsSeriesFieldsSelector;
