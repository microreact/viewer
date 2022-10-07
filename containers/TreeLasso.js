import { connectToPresentState } from "../utils/state";

import { setTreeFilter } from "../actions/trees";

import TreeLasso from "../components/TreeLasso";
import treeStateSelector from "../selectors/trees/tree-state";
import phylocanvasPropsSelector from "../selectors/trees/phylocanvas-props";

const mapStateToProps = (state, { treeId }) => {
  const treeState = treeStateSelector(state, treeId);
  return {
    isActive: treeState.lasso,
    path: treeState.path,
    phylocanvasProps: phylocanvasPropsSelector(state, treeId),
  };
};

const mapDispatchToProps = (dispatch, { treeId }) => ({
  onFilterChange: (ids, path) => dispatch(setTreeFilter(treeId, ids, path)),
});

export default connectToPresentState(TreeLasso, mapStateToProps, mapDispatchToProps);
