import { createSelector } from "reselect";

import filteredIdsSelector from "./filtered-ids";

const numberOfFilteredRowsSelector = createSelector(
  (state) => filteredIdsSelector(state),
  (
    filteredIds,
  ) => {
    if (filteredIds) {
      return filteredIds.size;
    }
    else {
      return 0;
    }
  },
);

export default numberOfFilteredRowsSelector;
