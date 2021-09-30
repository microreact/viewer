import { openPaneEditor } from "../actions/ui";
import { connectToPresentState } from "../utils/state";

import Component from "../components/PanePlaceholder.react";
import NetworkPane from "./NetworkPane.react";
import isValidNetworkSelector from "../selectors/networks/is-valid-network";
import networkFileSelector from "../selectors/networks/network-file";

const mapStateToProps = (state, { networkId }) => {
  return {
    componentName: "Network",
    file: networkFileSelector(state, networkId),
    isEmpty: !isValidNetworkSelector(state, networkId),
    PaneComponent: NetworkPane,
  };
};

const mapDispatchToProps = (dispatch, { networkId }) => ({
  onEditPane: () => dispatch(openPaneEditor(networkId)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
