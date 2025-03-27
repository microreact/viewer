import { createSelector } from "reselect";
import { sum } from "d3-array";

import numberOfRowsSelector from "../datasets/number-of-rows";
import rowsSelector from "../datasets/rows";
import filteredIdsSelector from "./filtered-ids";
import activeRowsSelector from "./active-rows";

const visibleRowCountSelector = createSelector(
  (state) => rowsSelector(state),
  (state) => numberOfRowsSelector(state),
  (state) => filteredIdsSelector(state),
  (state) => activeRowsSelector(state),
  (
    allRows,
    totalNumberOfRows,
    filteredIds,
    activeRows,
  ) => {
    if (filteredIds) {
      return sum(
        activeRows,
        (x) => x["--mr-scalar"] ?? 1,
      );
    }
    else if (allRows) {
      return totalNumberOfRows;
    }
    else {
      return 0;
    }
  },
);

export default visibleRowCountSelector;
