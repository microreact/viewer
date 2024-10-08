import { emptyArray } from "../../constants";
import { createCombinedStateSelector } from "../../utils/state";

import chartStateSelector from "./chart-state";

const allChartsSeriesFieldsSelector = createCombinedStateSelector(
  (state) => state.charts,
  (state, chartId) => {
    const chartState = chartStateSelector(state, chartId);
    return chartState.seriesField ?? chartState.categoriesField;
  },
  (fields) => {
    return Array.from(new Set(fields || emptyArray));
  },
);

export default allChartsSeriesFieldsSelector;
