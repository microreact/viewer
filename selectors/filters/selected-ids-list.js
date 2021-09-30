import { createSelector } from "reselect";

import filteredIdsSelector from "./filtered-ids";

const selectedIdsListSelector = createSelector(
  (state) => filteredIdsSelector(state),
  (state) => state.filters.selection,
  (
    filteredIds,
    selectedIds,
  ) => {
    if (filteredIds) {
      return selectedIds.filter((id) => filteredIds.has(id));
    }
    else {
      return selectedIds;
    }
  },
);

export default selectedIdsListSelector;
