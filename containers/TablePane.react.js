import { selectRows } from "../actions/filters";

import {
  expandColumn,
  moveColumn,
  resizeColumn,
  sortColumn,
} from "../actions/tables";

import selectedIdsListSelector from "../selectors/filters/selected-ids-list";
import sortStateSelector from "../selectors/tables/sort-state";
import tableDataSelector from "../selectors/tables/table-data";
import dataColumnsByFieldMapSelector from "../selectors/datasets/data-columns-by-field-map";

import TablePane from "../components/TablePane.react";
import { connectToPresentState } from "../utils/state";
import dataColumnsSelector from "../selectors/datasets/data-columns";

const mapStateToProps = (state, { tableId }) => {
  const tableState = state.tables[tableId];

  const data = tableDataSelector(state, tableId);
  const sort = sortStateSelector(state, tableId);
  const selectedIds = selectedIdsListSelector(state);

  return {
    data,
    sort,
    selectedIds,
    displayMode: tableState.displayMode,
    columns: tableState.columns,
    hasSelectionColumn: tableState.hasSelectionColumn,
    fieldsMap: dataColumnsByFieldMapSelector(state),
    dataColumns: dataColumnsSelector(state),
  };
};

const mapDispatchToProps = (dispatch, { tableId }) => ({
  onColumnExpand: (field) => dispatch(expandColumn(tableId, field)),
  onColumnMove: (oldIndex, newIndex) => dispatch(moveColumn(tableId, oldIndex, newIndex)),
  onColumnResize: (field, width) => dispatch(resizeColumn(tableId, field, width)),
  onColumnSort: (field, direction) => dispatch(sortColumn(tableId, field, direction)),
  onSelectRows: (ids, merge) => dispatch(selectRows(ids, merge)),
});

export default connectToPresentState(TablePane, mapStateToProps, mapDispatchToProps);
