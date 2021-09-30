import { update } from "../actions/slicers";

import { connectToPresentState } from "../utils/state";

import slicerStateSelector from "../selectors/slicers/slicer-state";
import dataColumnsSelector from "../selectors/datasets/data-columns";
import chartAxisTypeSelector from "../selectors/slicers/chart-axis-type";

import Component from "../components/SlicerPaneEditor.react";
import rowsSelector from "../selectors/datasets/rows";
import dataColumnSelector from "../selectors/slicers/data-column";

const mapStateToProps = (state, { slicerId }) => ({
  chartAxisType: chartAxisTypeSelector(state, slicerId),
  dataColumn: dataColumnSelector(state, slicerId),
  dataColumns: dataColumnsSelector(state),
  dataRows: rowsSelector(state),
  slicerState: slicerStateSelector(state, slicerId),
});

const mapDispatchToProps = (dispatch, { slicerId }) => ({
  onSlicerPropChange: (prop, value) => dispatch(update(slicerId, prop, value)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
