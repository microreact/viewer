import { emptyArray } from "../constants";
import dataColumnsByFieldMapSelector from "../selectors/datasets/data-columns-by-field-map";
import rowsSelector from "../selectors/datasets/rows";
import { filterByQuery } from "../utils/arrays";
import { getPresentState } from "../utils/state";

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
      const dataColumnsByFieldMap = dataColumnsByFieldMapSelector(state);
      const ids = filterByQuery(rows, dataColumnsByFieldMap, query);
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

export function setSelectionBreakdownField(field) {
  return {
    delay: true,
    group: "Filters/selection breakdown field",
    label: `Filters: Set selection breakdown column to ${field}`,
    payload: field,
    savable: false,
    type: "MICROREACT VIEWER/SET SELECTION BREAKDOWN FIELD",
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
  type: "MICROREACT VIEWER/SET SEARCH VALUE",
  payload: value,
  label: "Filters: Change search filter",
  group: "Filters/search",
  delay: true,
});

export const resetAllFilters = () => ({
  type: "MICROREACT VIEWER/RESET ALL FILTERS",
  payload: null,
  label: "Filters: Reset all filters",
  group: "Filters/reset",
  delay: true,
});

export const resetMapFilters = () => ({
  type: "MICROREACT VIEWER/RESET MAP FILTERS",
  payload: null,
  label: "Filters: Reset map filters",
  group: "Filters/reset",
  delay: true,
});

export const resetNetworkFilters = () => ({
  type: "MICROREACT VIEWER/RESET NETWORK FILTERS",
  payload: null,
  label: "Filters: Reset network filters",
  group: "Filters/reset",
  delay: true,
});

export const resetTableFilters = () => ({
  type: "MICROREACT VIEWER/RESET TABLE FILTERS",
  payload: null,
  label: "Filters: Reset table filters",
  group: "Filters/reset",
  delay: true,
});

export const resetTimelineFilters = () => ({
  type: "MICROREACT VIEWER/RESET TIMELINE FILTERS",
  payload: null,
  label: "Filters: Reset timeline filters",
  group: "Filters/reset",
  delay: true,
});

export const resetTreeFilters = () => ({
  type: "MICROREACT VIEWER/RESET TREE FILTERS",
  payload: null,
  label: "Filters: Reset tree filters",
  group: "Filters/reset",
  delay: true,
});
