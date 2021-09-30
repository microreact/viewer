import { createKeyedStateSelector } from "../../utils/state";
import { dataFieldToAxisType } from "../../utils/charts";

import chartStateSelector from "./chart-state";
import xAxisFieldSelector from "./x-axis-field";

const xAxisTypeSelector = createKeyedStateSelector(
  (state, chartId) => xAxisFieldSelector(state, chartId),
  (state, chartId) => chartStateSelector(state, chartId).xAxisType,
  (
    xAxisField,
    xAxisType,
  ) => {
    if (xAxisType === "auto") {
      return dataFieldToAxisType(xAxisField);
    }
    return xAxisType || dataFieldToAxisType(xAxisField);
  },
);

export default xAxisTypeSelector;
