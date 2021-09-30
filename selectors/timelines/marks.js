import { createKeyedStateSelector } from "../../utils/state";

import fullRangeChartDataSelector from "./full-range-chart-data";

const marksSelector = createKeyedStateSelector(
  (state, timelineId) => fullRangeChartDataSelector(state, timelineId),
  (
    { dataset },
  ) => {
    const marks = [];

    if (dataset && dataset.length) {
      for (const binData of dataset) {
        marks.push(binData.unitStartDate.valueOf());
      }

      marks.push(dataset[dataset.length - 1].unitEndDate.valueOf());
    }

    return marks;
  },
);

export default marksSelector;
