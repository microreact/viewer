import { createSelector } from "reselect";

import filteredNonDataIdsSelector from "./filtered-non-data-ids";
import filteredDataIdsSelector from "./filtered-data-ids";

const filteredIdsSelector = createSelector(
  (state) => filteredNonDataIdsSelector(state),
  (state) => filteredDataIdsSelector(state),
  (
    nonDataIds,
    tableIds,
  ) => {
    let ids;

    if (nonDataIds && (ids === undefined || nonDataIds.size < ids.size)) {
      ids = nonDataIds;
    }
    if (tableIds && (ids === undefined || tableIds.size < ids.size)) {
      ids = tableIds;
    }

    if (ids) {
      const intersection = new Set();

      for (const id of ids) {
        if (
          (nonDataIds === undefined || nonDataIds.has(id))
          &&
          (tableIds === undefined || tableIds.has(id))
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
