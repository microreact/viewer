import { createSelector } from "reselect";

import rowsSelector from "../datasets/rows";
import filteredIdsSelector from "./filtered-ids";

const visibleRowCountSelector = createSelector(
  (state) => rowsSelector(state),
  (state) => filteredIdsSelector(state),
  (
    allRows,
    filteredIds,
  ) => {
    if (filteredIds) {
      return filteredIds.size;
    }
    else if (allRows) {
      return allRows.length;
    }
    else {
      return 0;
    }
  },
);

export default visibleRowCountSelector;
