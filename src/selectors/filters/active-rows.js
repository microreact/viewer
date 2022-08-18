import { createSelector } from "reselect";

import rowsSelector from "../datasets/rows";
import filteredIdsSelector from "./filtered-ids";

const activeRowsSelector = createSelector(
  (state) => rowsSelector(state),
  (state) => filteredIdsSelector(state),
  (
    allRows,
    filteredIds,
  ) => {
    if (filteredIds) {
      const rows = [];
      for (const row of allRows) {
        if (filteredIds.has(row[0])) {
          rows.push(row);
        }
      }
      return rows;
    }
    else {
      return allRows;
    }
  },
);

export default activeRowsSelector;
