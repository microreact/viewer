import { createKeyedStateSelector } from "../../utils/state";

import filteredIdsSelector from "../filters/filtered-ids";
import groupedByUnitDataSelector from "./-grouped-by-unit-data-selector";
import selectedIdsSetSelector from "../filters/selected-ids-set";
import groupedByLaneDataSelector from "./-grouped-by-lane-data-selector";
import rowsWithStyleFieldsSelector from "../styles/rows-with-style-fields";

const chartDataSelector = createKeyedStateSelector(
  (state, timelineId) => {
    if (state.timelines[timelineId].style === "bubble" && state.timelines[timelineId].laneField) {
      return groupedByLaneDataSelector(state, timelineId);
    }
    else {
      return groupedByUnitDataSelector(state, timelineId);
    }
  },
  (state) => filteredIdsSelector(state),
  (state) => selectedIdsSetSelector(state),
  (state) => selectedIdsSetSelector(state),
  (state) => rowsWithStyleFieldsSelector(state),
  (
    groupedData,
    filteredIds,
    selectionSet,
  ) => {
    const dataset = [];

    for (const groupDatum of groupedData) {
      const groupFilteredRows = (
        filteredIds
          ?
          groupDatum.rows.filter((x) => filteredIds.has(x[0]))
          :
          groupDatum.rows
      );

      if (groupFilteredRows.length) {
        for (const row of groupFilteredRows) {
          dataset.push({
            rowId: row[0],
            // size: row["Month"] ?? 1,
            groupLabel: groupDatum.groupLabel,
            groupEntries: groupFilteredRows.length,
            groupStartDate: groupDatum.groupStartDate,
            groupEndDate: groupDatum.groupEndDate,
            laneLabel: groupDatum.laneLabel,
            colour: row["--microreact-colour"],
            "colour-label": row["--microreact-colour-label"],
            isSelected: (selectionSet.size === 0) || selectionSet.has(row[0]),
          });
        }
      }

    }

    return {
      dataset,
    };
  },
);

export default chartDataSelector;
