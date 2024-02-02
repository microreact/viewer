import { update } from "../actions/maps.js";
import { openPaneEditor } from "../actions/ui.js";

import MatrixControls from "../components/MatrixControls.js";

import { connectToPresentState } from "../utils/state.js";

import configSelector from "../selectors/config.js";

const mapStateToProps = (state, { matrixId }) => {
  const matrixState = state.matrices[matrixId];

  return {
    controls: matrixState.controls,
    isReadOnly: configSelector(state).readOnly,
  };
};

const mapDispatchToProps = (dispatch, { matrixId }) => ({
  onControlsChange: (value) => dispatch(update(matrixId, "controls", value)),
  onEditPane: () => dispatch(openPaneEditor(matrixId)),
});

export default connectToPresentState(MatrixControls, mapStateToProps, mapDispatchToProps);
