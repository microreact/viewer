import { createSelector } from "reselect";

import selectedIdsListSelector from "./selected-ids-list";

const numberOfSelectedRowsSelector = createSelector(
  (state) => selectedIdsListSelector(state),
  (
    selectedIds,
  ) => {
    if (selectedIds) {
      return selectedIds.length;
    }
    else {
      return 0;
    }
  },
);

export default numberOfSelectedRowsSelector;
