import { openPaneEditor } from "../actions/ui";
import { connectToPresentState } from "../utils/state";

import Component from "../components/PanePlaceholder.react";
import TreePane from "./TreePane.react";
import isValidTreeSelector from "../selectors/trees/is-valid-tree";
import treeFileSelector from "../selectors/trees/tree-file";

const mapStateToProps = (state, { treeId }) => {
  return {
    componentName: "Tree",
    file: treeFileSelector(state, treeId),
    isEmpty: !isValidTreeSelector(state, treeId),
    PaneComponent: TreePane,
  };
};

const mapDispatchToProps = (dispatch, { treeId }) => ({
  onEditPane: () => dispatch(openPaneEditor(treeId)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
