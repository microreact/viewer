import { update } from "../actions/trees";

import treeStateSelector from "../selectors/trees/tree-state";
import mergedDatasetSelector from "../selectors/datasets/full-dataset";
import treeFileSelector from "../selectors/trees/tree-file";

import { connectToPresentState } from "../utils/state";

import Component from "../components/TreePaneEditor.react";

const mapStateToProps = (state, { treeId }) => ({
  mergedDataset: mergedDatasetSelector(state),
  treeFile: treeFileSelector(state, treeId),
  treeState: treeStateSelector(state, treeId),
});

const mapDispatchToProps = (dispatch, { treeId }) => ({
  onTreePropChange: (prop, value) => dispatch(update(treeId, prop, value)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
