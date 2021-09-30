import { update, setLasso, downloadFile } from "../actions/networks";
import { openPaneEditor } from "../actions/ui";

import { connectToPresentState } from "../utils/state";

import Component from "../components/NetworkControls.react";

import edgeColourAttributesSelector from "../selectors/networks/edge-colour-attributes";
import edgeLabelAttributesSelector from "../selectors/networks/edge-label-attributes";
import edgeLineStyleAttributesSelector from "../selectors/networks/edge-line-style-attributes";
import edgeLineWidthAttributesSelector from "../selectors/networks/edge-line-width-attributes";

const mapStateToProps = (state, { networkId }) => {
  return {
    controls: state.networks[networkId].controls,
    edgeColourAttributes: edgeColourAttributesSelector(state, networkId),
    edgeColourFilter: state.networks[networkId].edgeColourFilter,
    edgeLabelAttributes: edgeLabelAttributesSelector(state, networkId),
    edgeLabelFilter: state.networks[networkId].edgeLabelFilter,
    edgeLineStyleAttributes: edgeLineStyleAttributesSelector(state, networkId),
    edgeLineStyleFilter: state.networks[networkId].edgeLineStyleFilter,
    edgeLineWidthAttributes: edgeLineWidthAttributesSelector(state, networkId),
    edgeLineWidthFilter: state.networks[networkId].edgeLineWidthFilter,
    labelSize: state.networks[networkId].labelSize,
    lasso: state.networks[networkId].lasso,
    maxLabelSize: state.networks[networkId].maxFontSize,
    maxNodeSize: state.networks[networkId].maxNodeSize,
    minLabelSize: state.networks[networkId].minFontSize,
    minNodeSize: state.networks[networkId].minNodeSize,
    networkFileId: state.networks[networkId].file,
    nodeSize: state.networks[networkId].nodeSize,
    showLabels: state.networks[networkId].showLabels,
    showNodes: state.networks[networkId].showNodes,
  };
};

const mapDispatchToProps = (dispatch, { networkId }) => ({
  onControlsChange: (value) => dispatch(update(networkId, "controls", value)),
  onEdgeFilterChange: (filter, value) => dispatch(update(networkId, filter, value)),
  onEditPane: () => dispatch(openPaneEditor(networkId)),
  onLabelSizeChange: (value) => dispatch(update(networkId, "labelSize", value)),
  onLassoChange: (value) => dispatch(setLasso(networkId, value)),
  onNodeSizeChange: (value) => dispatch(update(networkId, "nodeSize", value)),
  onShowLabelsChange: (value) => dispatch(update(networkId, "showLabels", value)),
  onShowNodesChange: (value) => dispatch(update(networkId, "showNodes", value)),
  onDownloadDOT: (fileId) => dispatch(downloadFile(networkId)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
