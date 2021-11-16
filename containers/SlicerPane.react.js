import Component from "../components/SlicerPane.react";

import { setFieldFilter } from "../actions/filters";

import chartAxisTypeSelector from "../selectors/slicers/chart-axis-type";
import chartDataSelector from "../selectors/slicers/chart-data";
import chartSpecSelector from "../selectors/slicers/chart-spec";
import dataColumnSelector from "../selectors/slicers/data-column";

import { connectToPresentState } from "../utils/state";
// import dataFieldFilterSelector from "../selectors/filters/data-field-filter";
import { openPaneEditor } from "../actions/ui";
import slicerStateSelector from "../selectors/slicers/slicer-state";
import configSelector from "../selectors/config";

function mapStateToProps(state, { slicerId }) {
  const dataColumn = dataColumnSelector(state, slicerId);
  const slicerState = slicerStateSelector(state, slicerId);
  return {
    chartAxisType: chartAxisTypeSelector(state, slicerId),
    chartData: chartDataSelector(state, slicerId),
    chartSpec: chartSpecSelector(state, slicerId),
    dataColumn,
    isReadOnly: configSelector(state).readOnly,
    slicerType: slicerState.slicerType,
  };
}

function mapDispatchToProps(dispatch, { slicerId }) {
  return {
    onEditPane: () => dispatch(openPaneEditor(slicerId)),
    onColumnFilterChange: (field, operator, value) => dispatch(setFieldFilter(field, operator, value)),
  };
}

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
