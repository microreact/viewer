import { createKeyedStateSelector } from "../../utils/state";
import { dataFieldToAxisType } from "../../utils/charts";

import chartStateSelector from "./chart-state";
import yAxisFieldSelector from "./y-axis-field";

const yAxisTypeSelector = createKeyedStateSelector(
  (state, chartId) => yAxisFieldSelector(state, chartId),
  (state, chartId) => chartStateSelector(state, chartId).yAxisType,
  (
    yAxisField,
    yAxisType,
  ) => {
    if (yAxisType === "auto") {
      return dataFieldToAxisType(yAxisField);
    }
    return yAxisType || dataFieldToAxisType(yAxisField);
  },
);

export default yAxisTypeSelector;
