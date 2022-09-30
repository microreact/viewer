import deepEqual from "fast-deep-equal";

import { emptyArray } from "../constants";
import rowsSelector from "../selectors/datasets/rows";
import { filterByQuery } from "../utils/arrays";
import { getPresentState } from "../utils/state";
import dataFieldFilterSelector from "../selectors/filters/data-field-filter";

export const selectRows = (ids = emptyArray, merge = false) => (
  (dispatch, getState) => {
    if (ids.length === 0) {
      const state = getPresentState(getState());
      if (state.filters.selection.length === 0) {
        return;
      }
    }

    dispatch({
      delay: true,
      label: "Filters: Select rows",
      payload: {
        ids,
        merge,
      },
      savable: false,
      type: "MICROREACT VIEWER/SELECT ROWS",
    });
  }
);

export const selectQueryRows = (query, merge = false) => (
  (dispatch, getState) => {
    if (query) {
      const state = getPresentState(getState());
      const rows = rowsSelector(state);
      const ids = filterByQuery(rows, query);
      dispatch(
        selectRows(
          ids,
          merge,
        )
      );
    }
    else {
      dispatch(
        selectRows(
          false,
          merge,
        )
      );
    }
  }
);

export function setChartFilter(chartId, filterQuery) {
  return {
    delay: true,
    label: "Filters: Change chart filter",
    group: `Filters/chart ${chartId}`,
    payload: {
      chartId,
      query: filterQuery,
    },
    type: "MICROREACT VIEWER/SET CHART FILTER",
  };
}

export function setSelectionSummaryField(field) {
  return {
    delay: true,
    group: "Filters/selection summary field",
    label: `Filters: Set selection summary column to ${field}`,
    payload: field,
    savable: false,
    type: "MICROREACT VIEWER/SET SELECTION SUMMARY FIELD",
  };
}

export function setFieldFilter(field, operator, value) {
  return {
    delay: true,
    label: `Filters: Change column ${field} filter`,
    group: `Filters/field ${field}`,
    payload: {
      field,
      operator,
      value,
    },
    type: "MICROREACT VIEWER/SET FIELD FILTER",
  };
}

export const setSearchOperator = (operator) => ({
  delay: true,
  group: "Filters/search",
  label: "Filters: Change search filter",
  payload: operator,
  type: "MICROREACT VIEWER/SET SEARCH OPERATOR",
});

export const setSearchValue = (value) => ({
  delay: true,
  group: "Filters/search",
  label: "Filters: Change search filter",
  payload: value,
  type: "MICROREACT VIEWER/SET SEARCH VALUE",
});

export function toggleFieldFilter(field, operator, value) {
  return (dispatch, getState) => {
    const state = getPresentState(getState());
    const dataFieldFilter = dataFieldFilterSelector(state, field);
    if (
      dataFieldFilter
      &&
      dataFieldFilter.operator === operator
      &&
      deepEqual(dataFieldFilter.value, value)
    ) {
      dispatch(
        setFieldFilter(field)
      );
    }
    else {
      dispatch(
        setFieldFilter(
          field,
          operator,
          value,
        )
      );
    }
  };
}

export const resetAllFilters = () => ({
  delay: true,
  group: "Filters/reset",
  label: "Filters: Reset all filters",
  payload: null,
  type: "MICROREACT VIEWER/RESET ALL FILTERS",
});

export const resetMapFilters = () => ({
  delay: true,
  group: "Filters/reset",
  label: "Filters: Reset map filters",
  payload: null,
  type: "MICROREACT VIEWER/RESET MAP FILTERS",
});

export const resetNetworkFilters = () => ({
  delay: true,
  group: "Filters/reset",
  label: "Filters: Reset network filters",
  payload: null,
  type: "MICROREACT VIEWER/RESET NETWORK FILTERS",
});

export const resetTableFilters = () => ({
  delay: true,
  group: "Filters/reset",
  label: "Filters: Reset table filters",
  payload: null,
  type: "MICROREACT VIEWER/RESET TABLE FILTERS",
});

export const resetTimelineFilters = () => ({
  delay: true,
  group: "Filters/reset",
  label: "Filters: Reset timeline filters",
  payload: null,
  type: "MICROREACT VIEWER/RESET TIMELINE FILTERS",
});

export const resetTreeFilters = () => ({
  delay: true,
  group: "Filters/reset",
  label: "Filters: Reset tree filters",
  payload: null,
  type: "MICROREACT VIEWER/RESET TREE FILTERS",
});
