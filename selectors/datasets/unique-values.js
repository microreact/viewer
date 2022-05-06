import { createKeyedStateSelector } from "../../utils/state";
import { uniqueElements } from "../../utils/arrays";

import rowsSelector from "./rows";
import dataColumnByFieldSelector from "./data-column-by-field";

/**
 * Returns unique values of a data column. Caches values by column name.
 *
 * @param {Object} state - Current viewer state
 * @param {String} field - The column name to be queried.
 */
const uniqueValuesSelector = createKeyedStateSelector(
  (state) => rowsSelector(state),
  (state, field) => dataColumnByFieldSelector(state, field),
  (
    rows,
    dataColumn,
  ) => {
    const uniqueRawValues = uniqueElements(
      rows,
      (x) => x[dataColumn.name]?.valueOf(),
      true,
    );
    if (dataColumn.dataType === "date") {
      const uniqueDateValues = [];
      for (const value of uniqueRawValues) {
        uniqueDateValues.push(new Date(value));
      }
      return uniqueDateValues;
    }
    else {
      return uniqueRawValues;
    }
  },
);

export default uniqueValuesSelector;
