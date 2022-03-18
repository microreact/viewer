import { selectRows, setSelectionSummaryField } from "../actions/filters";
import { setSidePane } from "../actions/panes";

import Component from "../components/SelectionPane.react";
import { emptyArray } from "../constants";
import selectedRowsSelector from "../selectors/filters/selected-rows";
import { connectToPresentState } from "../utils/state";
import dataColumnsSelector from "../selectors/datasets/data-columns";
import shapesDataColumnSelector from "../selectors/styles/shapes-data-column";
import activeRowsWithStyleFieldsSelector from "../selectors/filters/active-rows-with-style-fields";
import paneSizeSelector from "../selectors/panes/pane-size";
import configSelector from "../selectors/config";
import dataColumnByFieldSelector from "../selectors/datasets/data-column-by-field";
import coloursDataColumnSelector from "../selectors/styles/colours-data-column";
import colourMapForFieldSelector from "../selectors/styles/colour-map-for-field";

function mapStateToProps(state) {
  const summaryDataColumn = dataColumnByFieldSelector(state, state.filters.selectionSummaryField) ?? coloursDataColumnSelector(state);
  return {
    activeRowsWithStyleFields: activeRowsWithStyleFieldsSelector(state),
    defaults: configSelector(state),
    fullDatasetColumns: dataColumnsSelector(state),
    selectedRows: selectedRowsSelector(state) ?? emptyArray,
    selectionPaneSize: paneSizeSelector(state, "--mr-selection-pane"),
    selectionSummaryField: state.filters.selectionSummaryField,
    shapesDataColum: shapesDataColumnSelector(state),
    summaryColourMap: colourMapForFieldSelector(state, summaryDataColumn.name),
    summaryDataColumn,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClose: () => dispatch(setSidePane()),
    onSelectRows: (ids, merge) => dispatch(selectRows(ids, merge)),
    onSummaryFieldChange: (field) => dispatch(setSelectionSummaryField(field)),
  };
}

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
