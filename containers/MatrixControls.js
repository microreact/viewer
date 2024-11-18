import { updateMatrix } from "../actions/matrices.js";
import { openPaneEditor } from "../actions/ui.js";

import MatrixControls from "../components/MatrixControls.js";

import { connectToPresentState } from "../utils/state.js";

import configSelector from "../selectors/config.js";

const mapStateToProps = (state, { matrixId }) => {
  const matrixState = state.matrices[matrixId];

  return {
    rotateAxisLabels: matrixState.rotateAxisLabels,
    controls: matrixState.controls,
    showLabels: matrixState.showLabels,
    labelsUnit: matrixState.labelsUnit,
    labelsFontSize: matrixState.labelsFontSize,
    axisLabelsFontSize: matrixState.axisLabelsFontSize,
    truncateLabels: matrixState.truncateLabels,
    minFontSize: matrixState.minFontSize ?? 4,
    maxFontSize: matrixState.maxFontSize ?? 32,
    isReadOnly: configSelector(state).readOnly,
  };
};

const mapDispatchToProps = (dispatch, { matrixId }) => ({
  onControlsChange: (value) => dispatch(updateMatrix(matrixId, "controls", value)),
  onEditPane: () => dispatch(openPaneEditor(matrixId)),
  onLabelsFontSizeChange: (value) => dispatch(updateMatrix(matrixId, "labelsFontSize", value)),
  onAxisLabelsFontSizeChange: (value) => dispatch(updateMatrix(matrixId, "axisLabelsFontSize", value)),
  onLabelsUnitChange: (value) => dispatch(updateMatrix(matrixId, "labelsUnit", value)),
  onShowLabelsChange: (value) => dispatch(updateMatrix(matrixId, "showLabels", value)),
  onTruncateLabelsChange: (value) => dispatch(updateMatrix(matrixId, "truncateLabels", value)),
  onRotateAxisLabelsChange: (value) => dispatch(updateMatrix(matrixId, "rotateAxisLabels", value)),
});

export default connectToPresentState(MatrixControls, mapStateToProps, mapDispatchToProps);
