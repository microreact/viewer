import { connectToPresentState } from "../utils/state";
import { update as updateTable } from "../actions/tables";
import { updateDataset } from "../actions/datasets";
import Component from "../components/TablePaneEditor.react";
import dataColumnsSelector from "../selectors/datasets/data-columns";
import mainDatasetConfigSelector from "../selectors/datasets/main-dataset-config";
import tableStateSelector from "../selectors/tables/table-state";
import dataFilesSelector from "../selectors/files/data-files";
import { setMasterDataset } from "../actions/ui";
import dataColumnsByFieldMapSelector from "../selectors/datasets/data-columns-by-field-map";

function mapStateToProps(state, { tableId }) {
  const masterDataset = mainDatasetConfigSelector(state);
  const tableState = tableStateSelector(state, tableId);
  const dataFiles = dataFilesSelector(state);
  const masterDataFile = dataFiles.find((x) => x.id === masterDataset?.file);
  const datasets = Object.values(state.datasets);
  return {
    dataColumns: dataColumnsSelector(state),
    dataColumnsByFieldMap: dataColumnsByFieldMapSelector(state),
    dataFiles,
    datasets: Object.values(state.datasets),
    isLinkedDataset: !!(masterDataset && masterDataset.file !== tableState.file),
    isMasterDataset: !!(masterDataset && masterDataset.file === tableState.file),
    linkedDataFile: dataFiles.find((x) => x.id === tableState.file),
    masterDataFile,
    masterDataset,
    tableDataset: datasets.find((x) => x.file === tableState.file),
    tableState,
  };
}

const mapDispatchToProps = (dispatch, { tableId }) => ({
  onTablePropChange: (prop, value) => dispatch(updateTable(tableId, prop, value)),
  onUpdateDataset: (id, value) => dispatch(updateDataset(id, value)),
  onSetMasterDataset: (id) => dispatch(setMasterDataset(id)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
