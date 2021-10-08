import { connect } from "react-redux";

import { update } from "../actions/trees";

import TreeMetadataMenu from "../components/TreeMetadataMenu.react";
import dataColumnsSelector from "../selectors/datasets/data-columns";

const mapStateToProps = (state, { treeId }) => {
  const treeState = state.trees[treeId];
  return {
    blockHeaderFontSize: treeState.blockHeaderFontSize,
    blockSize: treeState.blockSize || treeState.blockLength,
    blockPadding: treeState.blockPadding,
    blocks: treeState.blocks,
    colourFields: dataColumnsSelector(state),
    fontSize: treeState.fontSize,
    maxBlockSize: 160,
    maxBlockPadding: 16,
    maxFontSize: 64,
    minBlockSize: 1,
    minBlockPadding: 0,
    minFontSize: 1,
    showBlockHeaders: treeState.showBlockHeaders,
    treeType: treeState.type,
  };
};

const mapDispatchToProps = (dispatch, { treeId }) => ({
  onBlockHeaderFontSizeChange: (value) => dispatch(update(treeId, "blockHeaderFontSize", value)),
  onBlockSizeChange: (value) => dispatch(update(treeId, "blockSize", value)),
  onBlockPaddingChange: (value) => dispatch(update(treeId, "blockPadding", value)),
  onBlocksChange: (value) => dispatch(update(treeId, "blocks", value)),
  onShowBlockHeadersChange: (value) => dispatch(update(treeId, "showBlockHeaders", value)),
});

export default connect((state, props) => mapStateToProps(state.present, props), mapDispatchToProps)(TreeMetadataMenu);
