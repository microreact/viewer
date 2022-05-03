import { update } from "../actions/slicers";

import { connectToPresentState } from "../utils/state";

import slicerStateSelector from "../selectors/slicers/slicer-state";
import dataColumnsSelector from "../selectors/datasets/data-columns";

import Component from "../components/SlicerPaneEditor.react";
import rowsSelector from "../selectors/datasets/rows";
import dataColumnsByFieldMapSelector from "../selectors/datasets/data-columns-by-field-map";

function mapStateToProps(state, { slicerId }) {
  const slicerState = slicerStateSelector(state, slicerId);
  const fieldsMap = dataColumnsByFieldMapSelector(state);
  const dataColumn = fieldsMap.get(slicerState.dataField || slicerState.field);
  const groupColumn = fieldsMap.get(slicerState.groupField);
  return {
    colourMode: slicerState.colourMode,
    dataColumn,
    dataColumns: dataColumnsSelector(state),
    dataRows: rowsSelector(state),
    displayMode: slicerState.displayMode,
    groupColumn,
    sortOrder: slicerState.sortOrder,
  };
}

const mapDispatchToProps = (dispatch, { slicerId }) => ({
  onSlicerPropChange: (prop, value) => dispatch(update(slicerId, prop, value)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
