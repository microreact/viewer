import { createKeyedStateSelector } from "../../utils/state";

import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";

const sortStateSelector = createKeyedStateSelector(
  (state, tableId) => state.tables[tableId].columns,
  (state) => dataColumnsByFieldMapSelector(state),
  (
    columns,
  ) => {
    const sortState = {};
    for (const column of columns) {
      if (column.sort) {
        sortState[column.field] = column.sort;
      }
    }
    return sortState;
  },
);

export default sortStateSelector;
