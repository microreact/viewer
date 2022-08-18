import { makePredicate } from "../../utils/expressions";
import { createKeyedStateSelector } from "../../utils/state";

import rowsSelector from "../datasets/rows";
import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";
import { filterByQuery } from "../../utils/arrays";

function chartFilterSelector(state, chartId) {
  return state.filters.chartFilters.find((x) => x.chartId === chartId);
}

const filteredChartIdsSelector = createKeyedStateSelector(
  (state) => rowsSelector(state),
  (state, chartId) => chartFilterSelector(state, chartId),
  (
    allRows,
    filter,
  ) => {
    if (filter && filter.query) {
      const ids = filterByQuery(allRows, filter.query);
      return new Set(ids);
    }

    return undefined;
  }
);

export default filteredChartIdsSelector;
