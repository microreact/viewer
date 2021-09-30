import { update } from "../actions/networks";

import { connectToPresentState } from "../utils/state";

import mergedDatasetSelector from "../selectors/datasets/full-dataset";
import networkFileSelector from "../selectors/networks/network-file";
import networkStateSelector from "../selectors/networks/network-state";

import Component from "../components/NetworkPaneEditor.react";

const mapStateToProps = (state, { networkId }) => ({
  mergedDataset: mergedDatasetSelector(state),
  networkFile: networkFileSelector(state, networkId),
  networkState: networkStateSelector(state, networkId),
});

const mapDispatchToProps = (dispatch, { networkId }) => ({
  onNetworkPropChange: (prop, value) => dispatch(update(networkId, prop, value)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
