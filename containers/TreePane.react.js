import { connect } from "react-redux";

import { selectRows } from "../actions/filters";
import {
  setPhylocanvasProps,
  setTreeFilter,
  update,
} from "../actions/trees";
import selectedIdsListSelector from "../selectors/filters/selected-ids-list";
import phylocanvasPropsSelector from "../selectors/trees/phylocanvas-props";

import TreePane from "../components/TreePane.react";
import { addHistoryEntry } from "../actions/ui";

const mapStateToProps = (state, { treeId }) => {
  const treeState = state.trees[treeId];
  return {
    controls: treeState.controls,
    isLassoActive: treeState.lasso,
    lassoPath: treeState.path || null,
    phylocanvasProps: phylocanvasPropsSelector(state, treeId),
    selectedIds: selectedIdsListSelector(state),
    treeType: state.trees[treeId].type,
  };
};

const mapDispatchToProps = (dispatch, { treeId }) => ({
  onAddHistoryEntry: (label) => dispatch(addHistoryEntry("Tree", label)),
  onAlignLabelsChange: (value) => dispatch(update(treeId, "alignLabels", value)),
  onFilterChange: (ids, path) => dispatch(setTreeFilter(treeId, ids, path)),
  onPhylocanvasStateChange: (updater, event) => dispatch(setPhylocanvasProps(treeId, updater, event)),
  onSelectRows: (ids, merge) => dispatch(selectRows(ids, merge)),
  onShowLeafLabelsChange: (value) => dispatch(update(treeId, "showLeafLabels", value)),
});

export default connect((state, props) => mapStateToProps(state.present, props), mapDispatchToProps)(TreePane);
