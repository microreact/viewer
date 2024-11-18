import matrixDataSelector from "../selectors/matrices/matrix-data.js";

import MatrixChart from "../components/MatrixVegaChart.js";
import { connectToPresentState } from "../utils/state.js";

import activeRowsIdsSelector from "../selectors/filters/active-row-ids.js";

function mapStateToProps(state, { matrixId }) {
  const matrixState = state.matrices[matrixId];
  return {
    rotateAxisLabels: matrixState.rotateAxisLabels,
    labelsUnit: matrixState.labelsUnit || "",
    showLabels: matrixState.showLabels,
    labelsFontSize: matrixState.labelsFontSize,
    axisLabelsFontSize: matrixState.axisLabelsFontSize,
    activeIdsSet: activeRowsIdsSelector(state),
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
