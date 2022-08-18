import { connect } from "react-redux";

import NetworkPane from "../components/NetworkPane.react";

import { selectRows } from "../actions/filters";
import { update, setFilter, setLayout } from "../actions/networks";

import graphSelector from "../selectors/networks/graph";
import hasLayoutSelector from "../selectors/networks/has-layout";

const mapStateToProps = (state, { networkId }) => {
  const networkState = state.networks[networkId];
  return {
    controls: networkState.controls,
    dragableNodes: true,
    geographicLayout: networkState.geographicLayout,
    graph: graphSelector(state, networkId),
    hasLasso: true,
    labelSize: networkState.labelSize,
    lassoActive: networkState.lasso,
    lassoPath: networkState.path,
    maxLabelSize: networkState.maxFontSize,
    maxNodeSize: networkState.maxNodeSize,
    minLabelSize: networkState.minFontSize,
    minNodeSize: networkState.minNodeSize,
    nodeSize: networkState.nodeSize,
    recomputeLayout: !hasLayoutSelector(state, networkId),
    showLabels: networkState.showLabels,
    showNodes: networkState.showNodes,
    viewport: networkState.viewport,
  };
};

const mapDispatchToProps = (dispatch, { networkId }) => ({
  onLassoPathChange: (path) => dispatch(setFilter(networkId, path)),
  onLayoutChange: (layout) => dispatch(setLayout(networkId, layout)),
  onNodeSelect: (ids, merge) => dispatch(selectRows(ids, merge)),
  onViewportChange: (value) => dispatch(update(networkId, "viewport", value)),
});

export default connect((state, props) => mapStateToProps(state.present, props), mapDispatchToProps)(NetworkPane);
