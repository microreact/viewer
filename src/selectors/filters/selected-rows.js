import { createSelector } from "reselect";

import rowsSelector from "../datasets/rows";
import selectedIdsSetSelector from "./selected-ids-set";

const selectedRowsSelector = createSelector(
  (state) => rowsSelector(state),
  (state) => selectedIdsSetSelector(state),
  (
    allRows,
    selectedId,
  ) => {
    if (selectedId && selectedId.size) {
      const rows = [];
      for (const row of allRows) {
        if (selectedId.has(row[0])) {
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
