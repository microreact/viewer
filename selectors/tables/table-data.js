import orderby from "lodash.orderby";

import { createKeyedStateSelector } from "../../utils/state";

import activeRowsWithStyleFieldsSelector from "../filters/active-rows-with-style-fields";
import sortStateSelector from "./sort-state";

const tableDataSelector = createKeyedStateSelector(
  (state) => activeRowsWithStyleFieldsSelector(state),
  (state, tableId) => sortStateSelector(state, tableId),
  (
    { rows },
    sortState,
  ) => {
    const fields = Object.keys(sortState);
    if (fields.length) {
      const sorted = orderby(
        rows,
        Object.keys(sortState),
        Object.values(sortState),
      );
      return [ sorted ];
    }
    else {
      return [ rows ];
    }
  },
);

export default tableDataSelector;
