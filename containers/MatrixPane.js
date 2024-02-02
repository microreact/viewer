import matrixDataSelector from "../selectors/matrices/matrix-data.js";

import MatrixPane from "../components/MatrixPane.js";
import { connectToPresentState } from "../utils/state.js";
import activeRowsWithStyleFieldsSelector from "../selectors/filters/active-rows-with-style-fields.js";
import filteredIdsSelector from "../selectors/filters/filtered-ids.js";

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
