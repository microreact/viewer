const hasMapsSelector = (state) => {
  return Object.keys(state.maps).length > 0;
};

export default hasMapsSelector;
