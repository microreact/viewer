import Component from "../components/SlicerPane.react";

import { setFieldFilter } from "../actions/filters";

import { connectToPresentState } from "../utils/state";

import { openPaneEditor } from "../actions/ui";

import configSelector from "../selectors/config";
import dataColumnByFieldSelector from "../selectors/datasets/data-column-by-field";
import dataColumnSelector from "../selectors/slicers/data-column";
import dataFieldFilterSelector from "../selectors/filters/data-field-filter";
import filterableValuesSelector from "../selectors/tables/filterable-values";
import rowsSelector from "../selectors/datasets/rows";
import slicerColoursMapSelector from "../selectors/slicers/slicer-colours-map";
import slicerStateSelector from "../selectors/slicers/slicer-state";

function mapStateToProps(state, { slicerId }) {
  const slicerState = slicerStateSelector(state, slicerId);
  const dataColumn = dataColumnSelector(state, slicerId);
  const groupColumn = dataColumnByFieldSelector(state, slicerState.groupField);
  return {
    allRows: rowsSelector(state),
    coloursMap: slicerColoursMapSelector(state, slicerId),
    columnFilter: dataColumn && dataFieldFilterSelector(state, dataColumn?.name),
    dataColumn,
    dataRows: rowsSelector(state),
    displayMode: slicerState.displayMode,
    groupColumn,
    isReadOnly: configSelector(state).readOnly,
    hideSearch: slicerState.hideSearch,
    hideSelectAll: slicerState.hideSelectAll,
    slicerType: slicerState.slicerType,
    sortOrder: slicerState.sortOrder,
    uniqueValues: dataColumn && filterableValuesSelector(state, dataColumn?.name),
  };
}

function mapDispatchToProps(dispatch, { slicerId }) {
  return {
    onEditPane: () => dispatch(openPaneEditor(slicerId)),
    onColumnFilterChange: (field, operator, value) => dispatch(setFieldFilter(field, operator, value)),
  };
}

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
