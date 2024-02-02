import { createSelector } from "reselect";

import rowsSelector from "../datasets/rows";
import filteredIdsSelector from "./filtered-ids";

const activeRowsIdsSelector = createSelector(
  (state) => rowsSelector(state),
  (state) => filteredIdsSelector(state),
  (
    allRows,
    filteredIds,
  ) => {
    if (filteredIds) {
      return filteredIds;
    }
    else {
      const rowIds = new Set();
      for (const row of allRows) {
        rowIds.add(row[0]);
      }
      return rowIds;
    }
  },
);

export default activeRowsIdsSelector;
