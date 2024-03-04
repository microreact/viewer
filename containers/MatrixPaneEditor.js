import { updateMatrix } from "../actions/matrices.js";

import { connectToPresentState } from "../utils/state";

import matrixFileSelector from "../selectors/matrices/matrix-file.js";
import matrixStateSelector from "../selectors/matrices/matrix-state";

import Component from "../components/MatrixPaneEditor.js";

const mapStateToProps = (state, { matrixId }) => ({
  matrixFile: matrixFileSelector(state, matrixId),
  matrixState: matrixStateSelector(state, matrixId),
});

const mapDispatchToProps = (dispatch, { matrixId }) => ({
  onMatrixPropChange: (prop, value) => dispatch(update(matrixId, prop, value)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
