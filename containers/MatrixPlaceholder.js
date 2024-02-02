import { openPaneEditor } from "../actions/ui.js";
import { connectToPresentState } from "../utils/state.js";

import PanePlaceholder from "../components/PanePlaceholder.react.js";
import MatrixPane from "./MatrixPane.js";

import isValidMapSelector from "../selectors/matrices/is-valid-matrix.js";
import matrixFileSelector from "../selectors/matrices/matrix-file.js";

const mapStateToProps = (state, { matrixId }) => {
  return {
    componentName: "Matrix",
    file: matrixFileSelector(state, matrixId),
    isEmpty: !isValidMapSelector(state, matrixId),
    PaneComponent: MatrixPane,
  };
};

const mapDispatchToProps = (dispatch, { matrixId }) => ({
  onEditPane: () => dispatch(openPaneEditor(matrixId)),
});

export default connectToPresentState(PanePlaceholder, mapStateToProps, mapDispatchToProps);
