import { createSelector } from "reselect";

import filteredNonDataIdsSelector from "./filtered-non-data-ids";
import filteredDataIdsSelector from "./filtered-data-ids";
import filteredChartsIdsSelector from "./filtered-charts-ids";

const filteredIdsSelector = createSelector(
  (state) => filteredNonDataIdsSelector(state),
  (state) => filteredDataIdsSelector(state),
  (state) => filteredChartsIdsSelector(state),
  (
    nonDataIds,
    tableIds,
    chartRowIds,
  ) => {
    let ids;

    if (nonDataIds && (ids === undefined || nonDataIds.size < ids.size)) {
      ids = nonDataIds;
    }
    if (tableIds && (ids === undefined || tableIds.size < ids.size)) {
      ids = tableIds;
    }
    if (chartRowIds && (ids === undefined || chartRowIds.size < ids.size)) {
      ids = chartRowIds;
    }

    if (ids) {
      const intersection = new Set();

      for (const id of ids) {
        if (
          (nonDataIds === undefined || nonDataIds.has(id))
          &&
          (tableIds === undefined || tableIds.has(id))
          &&
          (chartRowIds === undefined || chartRowIds.has(id))
        ) {
          intersection.add(id);
        }
      }

      return intersection;
    }

    // Return undefined to singnal that no active filters are applied
    return undefined;
  },
);

export default filteredIdsSelector;
