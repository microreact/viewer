import { createSelector } from "reselect";
import rowsSelector from "./rows";

const rowIdsSelector = createSelector(
  (state) => rowsSelector(state),
  (
    rows = [],
  ) => {
    const ids = [];
    for (const row of rows) {
      ids.push(row[0]);
    }
    return ids;
  },
);

export default rowIdsSelector;
