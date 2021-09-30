const hasNetworksSelector = (state) => {
  return Object.keys(state.networks).length > 0;
};

export default hasNetworksSelector;
