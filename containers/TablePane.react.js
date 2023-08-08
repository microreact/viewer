import { selectRows } from "../actions/filters";

import selectedIdsListSelector from "../selectors/filters/selected-ids-list";
import tableDataSelector from "../selectors/tables/table-data";
import dataColumnsByFieldMapSelector from "../selectors/datasets/data-columns-by-field-map";
import dataColumnsSelector from "../selectors/datasets/data-columns";

import { connectToPresentState } from "../utils/state";

import TablePane from "../components/TablePane.react";
import { moveColumn, resizeColumn } from "../actions/tables";
import { setColourByField } from "../actions/styles";

const mapStateToProps = (state, { tableId }) => {
  const tableState = state.tables[tableId];

  return {
    columns: tableState.columns,
    dataColumns: dataColumnsSelector(state),
    dataTable: tableDataSelector(state, tableId)[0], // QUESTION(james): Why do we only use a single dataset?
    displayMode: tableState.displayMode,
    fieldsMap: dataColumnsByFieldMapSelector(state),
    hasSelectionColumn: tableState.hasSelectionColumn,
    hideUnselectedRows: tableState.hideUnselected,
    selectedIds: selectedIdsListSelector(state),
  };
};

const mapDispatchToProps = (dispatch, { tableId }) => ({
  onColourByFieldChange: (field) => dispatch(setColourByField(field)),
  onColumnMove: (field, newIndex) => dispatch(moveColumn(tableId, field, newIndex)),
  onColumnResize: (field, width) => dispatch(resizeColumn(tableId, field, width)),
  onSelectRows: (ids, merge) => dispatch(selectRows(ids, merge)),
});

export default connectToPresentState(
  TablePane,
  mapStateToProps,
  mapDispatchToProps
);
