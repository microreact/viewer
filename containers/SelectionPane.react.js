import { selectRows, setSelectionBreakdownField } from "../actions/filters";
import { setSidePane } from "../actions/panes";

import Component from "../components/SelectionPane.react";
import { emptyArray } from "../constants";
import selectedRowsSelector from "../selectors/filters/selected-rows";
import { connectToPresentState } from "../utils/state";
import dataColumnsSelector from "../selectors/datasets/data-columns";
import colourMapForFieldSelector from "../selectors/styles/colour-map-for-field";
import shapesDataColumnSelector from "../selectors/styles/shapes-data-column";

function mapStateToProps(state) {
  const selectionBreakdownField = state.filters.selectionBreakdownField;
  return {
    selectedRows: selectedRowsSelector(state) ?? emptyArray,
    fullDatasetColumns: dataColumnsSelector(state),
    shapesDataColum: shapesDataColumnSelector(state),
    breakdownField: selectionBreakdownField,
    breakdownFieldColourMap: selectionBreakdownField ? colourMapForFieldSelector(state, selectionBreakdownField) : null,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClose: () => dispatch(setSidePane()),
    onSelectRows: (ids, merge) => dispatch(selectRows(ids, merge)),
    onBreakdownFieldChange: (field) => dispatch(setSelectionBreakdownField(field)),
  };
}

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
