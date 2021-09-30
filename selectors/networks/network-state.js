function networkStateSelector(state, networkId) {
  return state.networks[networkId];
}

export default networkStateSelector;
