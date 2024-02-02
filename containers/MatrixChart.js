import matrixDataSelector from "../selectors/matrices/matrix-data";

import MatrixChart from "../components/MatrixChart";
import { connectToPresentState } from "../utils/state";
import activeRowsWithStyleFieldsSelector from "../selectors/filters/active-rows-with-style-fields";
import filteredIdsSelector from "../selectors/filters/filtered-ids";
import activeRowsIdsSelector from "../selectors/filters/active-row-ids";

function mapStateToProps(state, { matrixId }) {
  const matrixState = state.matrices[matrixId];
  return {
    activeIdsSet: activeRowsIdsSelector(state),
    rows: activeRowsWithStyleFieldsSelector(state),
    matrixData: matrixDataSelector(state, matrixId),
  };
}

function mapDispatchToProps(dispatch, { matrixId }) {
  return {
  };
}

export default connectToPresentState(MatrixChart, mapStateToProps, mapDispatchToProps);
