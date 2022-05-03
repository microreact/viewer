import Component from "../components/SlicerPane.react";

import { setFieldFilter } from "../actions/filters";

import chartAxisTypeSelector from "../selectors/slicers/chart-axis-type";
import chartDataSelector from "../selectors/slicers/chart-data";
import chartSpecSelector from "../selectors/slicers/chart-spec";

import { connectToPresentState } from "../utils/state";
import { openPaneEditor } from "../actions/ui";
import slicerStateSelector from "../selectors/slicers/slicer-state";
import configSelector from "../selectors/config";
import filterableValuesSelector from "../selectors/tables/filterable-values";
import rowsSelector from "../selectors/datasets/rows";
import dataColumnsByFieldMapSelector from "../selectors/datasets/data-columns-by-field-map";
import dataFieldFilterSelector from "../selectors/filters/data-field-filter";

function mapStateToProps(state, { slicerId }) {
  const slicerState = slicerStateSelector(state, slicerId);
  const fieldsMap = dataColumnsByFieldMapSelector(state);
  const dataColumn = fieldsMap.get(slicerState.dataField || slicerState.field);
  const groupColumn = fieldsMap.get(slicerState.groupField);
  return {
    allRows: rowsSelector(state),
    colourMode: slicerState.colourMode,
    columnFilter: dataColumn && dataFieldFilterSelector(state, dataColumn?.name),
    dataColumn,
    dataRows: rowsSelector(state),
    displayMode: slicerState.displayMode,
    groupColumn,
    isReadOnly: configSelector(state).readOnly,
    // showSearchBox: slicerState.showSearchBox,
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
