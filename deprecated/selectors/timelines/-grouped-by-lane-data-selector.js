import { createKeyedStateSelector } from "../../utils/state";
import groupedByUnitDataSelector from "./-grouped-by-unit-data-selector";
import laneFieldSelector from "./lane-field";

const groupedByLaneDataSelector = createKeyedStateSelector(
  (state, timelineId) => groupedByUnitDataSelector(state, timelineId),
  (state, timelineId) => laneFieldSelector(state, timelineId),
  (
    binnedData,
    laneField,
  ) => {
    if (laneField) {
      const stackedData = [];

      for (const binData of binnedData) {

        const rowsByLaneLabel = {};
        for (const row of binData.rows) {
          const laneLabel = row[laneField.name];
          if (rowsByLaneLabel[laneLabel]) {
            rowsByLaneLabel[laneLabel].push(row);
          }
          else {
            rowsByLaneLabel[laneLabel] = [ row ];
          }
        }

        for (const laneLabel of Object.keys(rowsByLaneLabel)) {
          stackedData.push({
            groupLabel: binData.groupLabel,
            groupStartDate: binData.groupStartDate,
            groupEndDate: binData.groupEndDate,
            laneLabel,
            rows: rowsByLaneLabel[laneLabel],
          });
        }
      }

      return stackedData;
    }
    else {
      return binnedData;
    }
  }
);

export default groupedByLaneDataSelector;
