import networkStateSelector from "./network-state";

function isValidNetworkSelector(state, networkId) {
  const networkState = networkStateSelector(state, networkId);
  return networkState.file && networkState.nodeField;
}

export default isValidNetworkSelector;
