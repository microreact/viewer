import { createKeyedStateSelector } from "../../utils/state";
import { uniqueElements } from "../../utils/arrays";

import rowsSelector from "./rows";

/**
 * Returns unique values of a field. Caches values by field name.
 *
 * @param {Object} state - Current viewer state
 * @param {String} field - The column name to be queried.
 */
const uniqueValuesSelector = createKeyedStateSelector(
  (state) => rowsSelector(state),
  (_, field) => field,
  (
    rows,
    field,
  ) => {
    return uniqueElements(rows, field, true);
  },
);

export default uniqueValuesSelector;
