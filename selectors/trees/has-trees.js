const hasTreesSelector = (state) => {
  return Object.keys(state.trees).length > 0;
};

export default hasTreesSelector;
