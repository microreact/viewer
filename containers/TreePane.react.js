import { selectRows } from "../actions/filters";
import {
  setPhylocanvasProps,
  update,
} from "../actions/trees";
import selectedIdsListSelector from "../selectors/filters/selected-ids-list";
import phylocanvasPropsSelector from "../selectors/trees/phylocanvas-props";

import TreePane from "../components/TreePane.react";
import { addHistoryEntry } from "../actions/ui";
import { connectToPresentState } from "../utils/state";

const mapStateToProps = (state, { treeId }) => {
  const treeState = state.trees[treeId];
  return {
    controls: treeState.controls,
    phylocanvasProps: phylocanvasPropsSelector(state, treeId),
    selectedIds: selectedIdsListSelector(state),
    treeType: state.trees[treeId].type,
  };
};

const mapDispatchToProps = (dispatch, { treeId }) => ({
  onAddHistoryEntry: (label) => dispatch(addHistoryEntry("Tree", label)),
  onAlignLabelsChange: (value) => dispatch(update(treeId, "alignLabels", value)),
  onPhylocanvasPropsChange: (updater, event) => dispatch(setPhylocanvasProps(treeId, updater, event)),
  onSelectRows: (ids, merge) => dispatch(selectRows(ids, merge)),
  onShowLeafLabelsChange: (value) => dispatch(update(treeId, "showLeafLabels", value)),
});

export default connectToPresentState(TreePane, mapStateToProps, mapDispatchToProps);
