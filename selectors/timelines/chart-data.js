import { createKeyedStateSelector } from "../../utils/state";

import selectedIdsSetSelector from "../filters/selected-ids-set";
import rowsWithDateFieldSelector from "./rows-with-date-field";
import filteredRangeUnitSelector from "./filtered-range-unit";
import activeRowsWithStyleFieldsSelector from "../filters/active-rows-with-style-fields";

import { boundsOf, toUnitString } from "../../utils/datetime";
import { emptyArray } from "../../constants";

const chartDataSelector = createKeyedStateSelector(
  (state, timelineId) => rowsWithDateFieldSelector(state, timelineId),
  (state, timelineId) => filteredRangeUnitSelector(state, timelineId),
  (state) => selectedIdsSetSelector(state),
  (state) => activeRowsWithStyleFieldsSelector(state),
  (
    { dateFieldName, extent },
    unit,
    selectionSet,
    { rows },
  ) => {
    let dataset = null;

    if (dateFieldName) {
      const groups = {};

      const range = extent[1].valueOf() - extent[0].valueOf();

      // const countsByUnits = {};

      for (const row of rows) {
        if (row[dateFieldName]) {
          const rowCount = row["--mr-scalar"] ?? 1;

          const groupKey = toUnitString(row[dateFieldName], unit);
          // countsByUnits[groupKey] = (countsByUnits[groupKey] ?? 0) + rowCount;

          // const groupKey = `${unitLabel} ${row["--microreact-colour"]}`;

          if (groupKey in groups) {
            groups[groupKey].groupCount += rowCount;
            // if (!groups[groupKey].isSelected) {
            //   groups[groupKey].isSelected = selectionSet.has(row[0]);
            // }
          }
          else {
            const [ unitStartDate, unitEndDate ] = boundsOf(row[dateFieldName], unit);
            groups[groupKey] = {
              x0: ((unitStartDate.valueOf() - extent[0].valueOf()) / range),
              x1: ((unitEndDate.valueOf() - extent[0].valueOf()) / range),
              unitLabel: groupKey,
              unitStartDate,
              unitEndDate,
              groupCount: rowCount,
              // groupColour: row["--microreact-colour"],
              // groupLabel: row["--microreact-colour-label"],
              // isSelected: (selectionSet.size === 0) || selectionSet.has(row[0]),
            };
          }
        }
      }

      dataset = Object.values(groups);

      // for (const item of dataset) {
      //   item.unitCount = countsByUnits[item.unitLabel];
      // }
    }

    return dataset ?? emptyArray;
  },
);

export default chartDataSelector;
