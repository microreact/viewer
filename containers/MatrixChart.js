import activeRowsIdsSelector from "../selectors/filters/active-row-ids.js";
import matrixDataSelector from "../selectors/matrices/matrix-data.js";
import filteredIdsSelector from "../selectors/filters/filtered-ids.js";

import { connectToPresentState } from "../utils/state.js";

import MatrixChart from "../components/MatrixVegaChart.js";

function mapStateToProps(state, { matrixId }) {
  const matrixState = state.matrices[matrixId];
  return {
    rotateAxisLabels: matrixState.rotateAxisLabels,
    labelsUnit: matrixState.labelsUnit || "",
    showLabels: matrixState.showLabels,
    labelsFontSize: matrixState.labelsFontSize,
    axisLabelsFontSize: matrixState.axisLabelsFontSize,
    activeIdsSet: activeRowsIdsSelector(state),
    filteredIds: filteredIdsSelector(state),
    hideUnmatched: matrixState.hideUnmatched,
    matrixData: matrixDataSelector(state, matrixId),
  };
}

function mapDispatchToProps(dispatch, { matrixId }) {
  return {
  };
}

export default connectToPresentState(
  MatrixChart,
  mapStateToProps,
  mapDispatchToProps,
);
