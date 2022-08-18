import layoutSelector from "./layout";

const hasLayoutSelector = (state, networkId) => {
  return layoutSelector(state, networkId) !== null;
};

export default hasLayoutSelector;
