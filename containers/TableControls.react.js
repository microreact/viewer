import { update, setVisibleColumns, downloadAsCsv } from "../actions/tables";
import { openPaneEditor } from "../actions/ui";

import TableControls from "../components/TableControls.react";
import dataColumnsSelector from "../selectors/datasets/data-columns";
import visibleFieldsSelector from "../selectors/tables/visible-fields";
import { connectToPresentState } from "../utils/state";

const mapStateToProps = (state, { tableId }) => {
  const tableState = state.tables[tableId];
  return {
    controls: !!tableState.controls,
    dataFields: dataColumnsSelector(state),
    displayMode: tableState.displayMode,
    showSelection: tableState.showSelection,
    visibleFields: visibleFieldsSelector(state, tableId),
  };
};

const mapDispatchToProps = (dispatch, { tableId }) => ({
  onControlsChange: (value) => dispatch(update(tableId, "controls", value)),
  onDisplayModeChange: (value) => dispatch(update(tableId, "displayMode", value)),
  onDownloadCsv: () => dispatch(downloadAsCsv(tableId)),
  onEditPane: () => dispatch(openPaneEditor(tableId)),
  onShowSelecttionChange: (value) => dispatch(update(tableId, "showSelection", value)),
  onVisibleFieldsChange: (fields) => dispatch(setVisibleColumns(tableId, fields)),
});

export default connectToPresentState(TableControls, mapStateToProps, mapDispatchToProps);
