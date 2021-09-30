import { createSelector } from "reselect";

import { makePredicate } from "../../utils/search";

import dataColumnsSelector from "../datasets/data-columns";
import rowsSelector from "../datasets/rows";

const filteredSearchIdsSelector = createSelector(
  (state) => rowsSelector(state),
  (state) => dataColumnsSelector(state),
  (state) => state.filters.searchOperator,
  (state) => state.filters.searchValue,
  (
    dataRows,
    dataColumns,
    searchOperator,
    searchValue,
  ) => {
    if (searchValue) {
      const predicate = makePredicate(searchOperator, [ searchValue ]);

      const rowIds = new Set();

      for (const dataColumn of dataColumns) {
        for (const row of dataRows) {
          if (!rowIds.has(row[0]) && row[dataColumn.name] !== null && predicate(row[dataColumn.name])) {
            rowIds.add(row[0]);
          }
        }
      }

      return rowIds;
    }
    else {
      return undefined;
    }
  }
);

export default filteredSearchIdsSelector;
