import { createKeyedStateSelector } from "../../utils/state";

import fullRangeChartDataSelector from "./full-range-chart-data";

const fullRangeExtentSelector = createKeyedStateSelector(
  (state, timelineId) => fullRangeChartDataSelector(state, timelineId),
  (
    { dataset },
  ) => {
    if (dataset && dataset.length) {
      return [
        dataset[0].unitStartDate.valueOf(),
        dataset[dataset.length - 1].unitEndDate.valueOf(),
      ];
    }
    else {
      return null;
    }
  },
);

export default fullRangeExtentSelector;
