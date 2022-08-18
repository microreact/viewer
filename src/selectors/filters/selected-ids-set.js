import { createSelector } from "reselect";

import selectedIdsListSelector from "./selected-ids-list";

const selectedIdsSetSelector = createSelector(
  (state) => selectedIdsListSelector(state),
  (selectedIds) => {
    return new Set(selectedIds);
  },
);

export default selectedIdsSetSelector;
