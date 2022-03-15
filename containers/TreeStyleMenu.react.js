import { connect } from "react-redux";

import { update } from "../actions/trees";

import TreeStyleMenu from "../components/TreeStyleMenu.react";

const mapStateToProps = (state, { treeId }) => ({
  alignLabels: state.trees[treeId].alignLabels,
  branchLengthsDigits: state.trees[treeId].branchLengthsDigits,
  fontSize: state.trees[treeId].fontSize,
  maxFontSize: 64,
  maxNodeSize: 64,
  minFontSize: 4,
  minNodeSize: 1,
  nodeSize: state.trees[treeId].nodeSize,
  roundBranchLengths: state.trees[treeId].roundBranchLengths,
  scaleLineAlpha: state.trees[treeId].scaleLineAlpha,
  showBranchLengths: state.trees[treeId].showBranchLengths,
  showInternalLabels: state.trees[treeId].showInternalLabels,
  showLeafLabels: state.trees[treeId].showLeafLabels,
  showPiecharts: state.trees[treeId].showPiecharts,
  showShapeBorders: state.trees[treeId].showShapeBorders,
  showShapes: state.trees[treeId].showShapes,
  styleLeafLabels: state.trees[treeId].styleLeafLabels,
  styleLeafNodes: state.trees[treeId].styleLeafNodes,
  styleNodeEdges: state.trees[treeId].styleNodeEdges,
  styleNodeLines: state.trees[treeId].styleNodeLines,
});

const mapDispatchToProps = (dispatch, { treeId }) => ({
  onAlignLabelsChange: (value) => dispatch(update(treeId, "alignLabels", value)),
  onFontSizeChange: (value) => dispatch(update(treeId, "fontSize", value)),
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

export default connect((state, props) => mapStateToProps(state.present, props), mapDispatchToProps)(TreeStyleMenu);
