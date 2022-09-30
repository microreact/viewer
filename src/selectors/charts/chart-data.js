import { createSelector } from "reselect";

import activeRowsWithStyleFieldsSelector from "../filters/active-rows-with-style-fields";
import chartStateSelector from "./chart-state";

import { createKeyedStateSelector, createCombinedStateSelector } from "../../utils/state";
import { intersect } from "../../utils/sets";

import filteredChartIdsSelector from "../filters/filtered-chart-ids";
import rowsSelector from "../datasets/rows";
import filteredNonDataIdsSelector from "../filters/filtered-non-data-ids";
import filteredDataIdsSelector from "../filters/filtered-data-ids";

const filterChartIdsSelector = createCombinedStateSelector(
  (state, chartId) => state.filters.chartFilters.map((x) => x.chartId).filter((x) => x !== chartId),
  filteredChartIdsSelector,
  (sets) => {
    return intersect(sets.filter((x) => x !== undefined));
  },
);

const filterChartDataSelector = createKeyedStateSelector(
  (state) => rowsSelector(state),
  (state) => filteredNonDataIdsSelector(state),
  (state) => filteredDataIdsSelector(state),
  (state, chartId) => filterChartIdsSelector(state, chartId),
  (state) => activeRowsWithStyleFieldsSelector(state),
  (
    allRows,
    filteredNonDataIds,
    filteredDataIds,
    chartRowIds,
  ) => {
    const rows = [];

    for (const row of allRows) {
      if (
        (!filteredNonDataIds || filteredNonDataIds.has(row[0]))
        &&
        (!filteredDataIds || filteredDataIds.has(row[0]))
        &&
        (!chartRowIds || chartRowIds.has(row[0]))
      ) {
        rows.push(row);
      }
    }

    return { table: rows };
  },
);

const simpleChartDataSelector = createSelector(
  (state) => activeRowsWithStyleFieldsSelector(state),
  (
    { rows },
  ) => {
    return { table: rows };
  },
);

const chartDataSelector = (state, chartId) => {
  const chartState = chartStateSelector(state, chartId);
  if (chartState.filterChart) {
    return filterChartDataSelector(state, chartId);
  }
  else {
    return simpleChartDataSelector(state);
  }
};

export default chartDataSelector;
