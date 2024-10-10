import { update } from "../actions/slicers";

import { connectToPresentState } from "../utils/state";

import slicerStateSelector from "../selectors/slicers/slicer-state";
import dataColumnsSelector from "../selectors/datasets/data-columns";

import Component from "../components/SlicerPaneEditor.react";
import rowsSelector from "../selectors/datasets/rows";
import dataColumnSelector from "../selectors/slicers/data-column";
import dataColumnByFieldSelector from "../selectors/datasets/data-column-by-field";

function mapStateToProps(state, { slicerId }) {
  const slicerState = slicerStateSelector(state, slicerId);
  const dataColumn = dataColumnSelector(state, slicerId);
  const groupColumn = dataColumnByFieldSelector(state, slicerState.groupField);
  return {
    dataColumn,
    dataColumns: dataColumnsSelector(state),
    dataRows: rowsSelector(state),
    displayMode: slicerState.displayMode,
    groupColumn,
    hideSearch: slicerState.hideSearch,
    hideSelectAll: slicerState.hideSelectAll,
    sortOrder: slicerState.sortOrder,
  };
}

const mapDispatchToProps = (dispatch, { slicerId }) => ({
  onSlicerPropChange: (prop, value) => dispatch(update(slicerId, prop, value)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
