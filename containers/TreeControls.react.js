import { update, setTreeLasso } from "../actions/trees";
import { openPaneEditor } from "../actions/ui";

import { connectToPresentState } from "../utils/state";

import Component from "../components/TreeControls.react";
import configSelector from "../selectors/config";

const mapStateToProps = (state, { treeId }) => ({
  controls: state.trees[treeId].controls,
  isReadOnly: configSelector(state).readOnly,
  lasso: state.trees[treeId].lasso,
  type: state.trees[treeId].type,
});

const mapDispatchToProps = (dispatch, { treeId }) => ({
  onControlsChange: (value) => dispatch(update(treeId, "controls", value)),
  onEditPane: () => dispatch(openPaneEditor(treeId)),
  onLassoChange: (value) => dispatch(setTreeLasso(treeId, value)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
