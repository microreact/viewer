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
    savable: false,
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
  payload: null,
  label: "Filters: Reset tree filters",
  group: "Filters/reset",
  delay: true,
  type: "MICROREACT VIEWER/RESET TREE FILTERS",
});
