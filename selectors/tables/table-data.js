import orderby from "lodash.orderby";

import { createKeyedStateSelector } from "../../utils/state";

import activeRowsWithStyleFieldsSelector from "../filters/active-rows-with-style-fields";
import selectedRowsSelector from "../filters/selected-rows";
import sortStateSelector from "./sort-state";
import tableStateSelector from "./table-state";

const dataSelector = (state, tableId) => {
  const tableState = tableStateSelector(state, tableId);
  if (tableState.hideUnselected) {
    const selectedRows = selectedRowsSelector(state);
    return selectedRows ? { rows: selectedRows } : activeRowsWithStyleFieldsSelector(state);
  }
  else {
    return activeRowsWithStyleFieldsSelector(state);
  }
};

const tableDataSelector = createKeyedStateSelector(
  (state, tableId) => dataSelector(state, tableId),
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
