import { createKeyedStateSelector } from "../../utils/state";
import { dataFieldToAxisType } from "../../utils/charts";

import chartStateSelector from "./chart-state";
import seriesFieldSelector from "./series-field";

const seriesTypeSelector = createKeyedStateSelector(
  (state, chartId) => seriesFieldSelector(state, chartId),
  (state, chartId) => chartStateSelector(state, chartId).seriesType,
  (
    seriesField,
    seriesType,
  ) => {
    if (seriesType === "auto") {
      return dataFieldToAxisType(seriesField);
    }
    return seriesType || dataFieldToAxisType(seriesField);
  },
);

export default seriesTypeSelector;
