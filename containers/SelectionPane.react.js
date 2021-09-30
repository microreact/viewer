import { selectRows, setSelectionBreakdownField } from "../actions/filters";
import { setSidePane } from "../actions/panes";

import Component from "../components/SelectionPane.react";
import { emptyArray } from "../constants";
import selectedRowsSelector from "../selectors/filters/selected-rows";
import { connectToPresentState } from "../utils/state";
import dataColumnsSelector from "../selectors/datasets/data-columns";

function mapStateToProps(state) {
  return {
    selectedRows: selectedRowsSelector(state) ?? emptyArray,
    fullDatasetColumns: dataColumnsSelector(state),
    selectionBreakdownField: state.filters.selectionBreakdownField,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClose: () => dispatch(setSidePane()),
    onSelectRows: (ids, merge) => dispatch(selectRows(ids, merge)),
    onSelectionBreakdownFieldChange: (field) => dispatch(setSelectionBreakdownField(field)),
  };
}

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
