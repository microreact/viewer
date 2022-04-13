import { update } from "../actions/trees";

import { connectToPresentState } from "../utils/state";

import Component from "../components/TreeStyleMenu.react";

const mapStateToProps = (state, { treeId }) => {
  const treeState = state.trees[treeId];
  return {
    alignLabels: treeState.alignLabels,
    branchLabelsFontSize: treeState.branchLabelsFontSize,
    branchLengthsDigits: treeState.branchLengthsDigits,
    filterInternalLabels: treeState.filterInternalLabels,
    fontSize: treeState.fontSize,
    internalLabelsFilterRange: treeState.internalLabelsFilterRange,
    internalLabelsFontSize: treeState.internalLabelsFontSize,
    maxFontSize: 64,
    maxNodeSize: 64,
    minFontSize: 4,
    minNodeSize: 1,
    nodeSize: treeState.nodeSize,
    roundBranchLengths: treeState.roundBranchLengths,
    scaleLineAlpha: treeState.scaleLineAlpha,
    showBranchLengths: treeState.showBranchLengths,
    showInternalLabels: treeState.showInternalLabels,
    showLeafLabels: treeState.showLeafLabels,
    showPiecharts: treeState.showPiecharts,
    showShapeBorders: treeState.showShapeBorders,
    showShapes: treeState.showShapes,
    styleLeafLabels: treeState.styleLeafLabels,
    styleLeafNodes: treeState.styleLeafNodes,
    styleNodeEdges: treeState.styleNodeEdges,
    styleNodeLines: treeState.styleNodeLines,
  };
};

const mapDispatchToProps = (dispatch, { treeId }) => ({
  onAlignLabelsChange: (value) => dispatch(update(treeId, "alignLabels", value)),
  onBranchLabelsFontSizeChange: (value) => dispatch(update(treeId, "branchLabelsFontSize", value)),
  onFilterInternalLabelsChange: (value) => dispatch(update(treeId, "filterInternalLabels", value)),
  onFontSizeChange: (value) => dispatch(update(treeId, "fontSize", value)),
  onInternalLabelsFilterRangeChange: (minValue, maxValue) => dispatch(update(treeId, "internalLabelsFilterRange", [ minValue, maxValue ])),
  onInternalLabelsFontSizeChange: (value) => dispatch(update(treeId, "internalLabelsFontSize", value)),
  onNodeSizeChange: (value) => dispatch(update(treeId, "nodeSize", value)),
  onRoundBranchLengthsChange: (value) => dispatch(update(treeId, "roundBranchLengths", value)),
  onRoundBranchLengthsDigitsChange: (value) => dispatch(update(treeId, "branchLengthsDigits", value)),
  onScaleLineAlphaChange: (value) => dispatch(update(treeId, "scaleLineAlpha", value)),
  onShowBranchLengthsChange: (value) => dispatch(update(treeId, "showBranchLengths", value)),
  onShowInternalLabelsChange: (value) => dispatch(update(treeId, "showInternalLabels", value)),
  onShowLeafLabelsChange: (value) => dispatch(update(treeId, "showLeafLabels", value)),
  onShowPiechartsChange: (value) => dispatch(update(treeId, "showPiecharts", value)),
  onShowShapeBordersChange: (value) => dispatch(update(treeId, "showShapeBorders", value)),
  onShowShapesChange: (value) => dispatch(update(treeId, "showShapes", value)),
  onStyleLeafLabelsChange: (value) => dispatch(update(treeId, "styleLeafLabels", value)),
  onStyleLeafNodesChange: (value) => dispatch(update(treeId, "styleLeafNodes", value)),
  onStyleNodeEdgesChange: (value) => dispatch(update(treeId, "styleNodeEdges", value)),
  onStyleNodeLinesChange: (value) => dispatch(update(treeId, "styleNodeLines", value)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
