import { emptyArray } from "../../constants";

import { boundsOf, toUnitString, unitFromRange } from "../../utils/datetime";
import { createKeyedStateSelector } from "../../utils/state";

import paneSizeSelector from "../panes/pane-size";
import rowsSelector from "../datasets/rows";
import rowsWithDateFieldSelector from "./rows-with-date-field";

const fullRangeUnitSelector = createKeyedStateSelector(
  (state, timelineId) => rowsWithDateFieldSelector(state, timelineId),
  (state, timelineId) => paneSizeSelector(state, timelineId),
  (
    { extent },
    size,
  ) => {
    if (extent) {
      return unitFromRange(
        extent,
        size.width / 8,
      );
    }
    else {
      return "day";
    }
  },
);

const fullRangeChartDataSelector = createKeyedStateSelector(
  (state, timelineId) => rowsWithDateFieldSelector(state, timelineId),
  (state, timelineId) => fullRangeUnitSelector(state, timelineId),
  (state) => rowsSelector(state),
  (
    { dateFieldName },
    unit,
    rows,
  ) => {
    let dataset = emptyArray;

    if (dateFieldName) {
      const groups = {};

      for (const row of rows) {
        if (row[dateFieldName]) {
          const rowCount = row["--mr-scalar"] ?? 1;

          const unitLabel = toUnitString(row[dateFieldName], unit);

          if (unitLabel in groups) {
            groups[unitLabel].groupCount += rowCount;
          }
          else {
            const [ unitStartDate, unitEndDate ] = boundsOf(row[dateFieldName], unit);
            groups[unitLabel] = {
              unitLabel,
              unitStartDate,
              unitEndDate,
              groupCount: rowCount,
            };
          }
        }
      }

      dataset = Object.values(groups);

      dataset.sort((a, b) => a.unitStartDate - b.unitStartDate);
    }

    return {
      dataset,
    };
  },
);

export default fullRangeChartDataSelector;
