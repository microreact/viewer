import { updateMatrix } from "../actions/matrices.js";
import { openPaneEditor } from "../actions/ui.js";

import configSelector from "../selectors/config.js";
import matrixDataSelector from "../selectors/matrices/matrix-data.js";
import rowIdsSelector from "../selectors/datasets/row-ids.js";

import { connectToPresentState } from "../utils/state.js";

import MatrixControls from "../components/MatrixControls.js";

const mapStateToProps = (state, { matrixId }) => {
  const matrixState = state.matrices[matrixId];

  return {
    axisLabelsFontSize: matrixState.axisLabelsFontSize,
    controls: matrixState.controls,
    hideUnmatched: matrixState.hideUnmatched,
    isReadOnly: configSelector(state).readOnly,
    labelsFontSize: matrixState.labelsFontSize,
    labelsUnit: matrixState.labelsUnit,
    matrixData: matrixDataSelector(state, matrixId),
    maxFontSize: matrixState.maxFontSize ?? 32,
    minFontSize: matrixState.minFontSize ?? 4,
    rotateAxisLabels: matrixState.rotateAxisLabels,
    rowIds: rowIdsSelector(state),
    showLabels: matrixState.showLabels,
    truncateLabels: matrixState.truncateLabels,
  };
};

const mapDispatchToProps = (dispatch, { matrixId }) => ({
  onAxisLabelsFontSizeChange: (value) => dispatch(updateMatrix(matrixId, "axisLabelsFontSize", value)),
  onControlsChange: (value) => dispatch(updateMatrix(matrixId, "controls", value)),
  onEditPane: () => dispatch(openPaneEditor(matrixId)),
  onHideUnmatchedChange: (value) => dispatch(updateMatrix(matrixId, "hideUnmatched", value)),
  onLabelsFontSizeChange: (value) => dispatch(updateMatrix(matrixId, "labelsFontSize", value)),
  onLabelsUnitChange: (value) => dispatch(updateMatrix(matrixId, "labelsUnit", value)),
  onRotateAxisLabelsChange: (value) => dispatch(updateMatrix(matrixId, "rotateAxisLabels", value)),
  onShowLabelsChange: (value) => dispatch(updateMatrix(matrixId, "showLabels", value)),
  onTruncateLabelsChange: (value) => dispatch(updateMatrix(matrixId, "truncateLabels", value)),
});

export default connectToPresentState(
  MatrixControls,
  mapStateToProps,
  mapDispatchToProps,
);
