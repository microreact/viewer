import matrixDataSelector from "../selectors/matrices/matrix-data";

import MatrixPane from "../components/MatrixPane";
import { connectToPresentState } from "../utils/state";
import activeRowsWithStyleFieldsSelector from "../selectors/filters/active-rows-with-style-fields";
import filteredIdsSelector from "../selectors/filters/filtered-ids";

function mapStateToProps(state, { matrixId }) {
  const matrixState = state.matrices[matrixId];
  return {
    ids: filteredIdsSelector(state),
    rows: activeRowsWithStyleFieldsSelector(state),
    controls: matrixState.controls,
    file: matrixDataSelector(state, matrixId),
  };
}

function mapDispatchToProps(dispatch, { matrixId }) {
  return {
  };
}

export default connectToPresentState(MatrixPane, mapStateToProps, mapDispatchToProps);
