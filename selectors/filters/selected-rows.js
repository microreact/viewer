import { createSelector } from "reselect";

import rowsSelector from "../datasets/rows";
import selectedIdsSetSelector from "./selected-ids-set";

const selectedRowsSelector = createSelector(
  (state) => rowsSelector(state),
  (state) => selectedIdsSetSelector(state),
  (
    allRows,
    selectedIds,
  ) => {
    if (selectedIds && selectedIds.size) {
      const rows = [];
      for (const row of allRows) {
        if (selectedIds.has(row[0])) {
          rows.push(row);
        }
      }
      return rows;
    }
    else {
      return undefined;
    }
  },
);

export default selectedRowsSelector;
