import layoutModelSelector from "./layout-model";

const paneNameSelector = (state, paneId) => {
  const model = layoutModelSelector(state);
  const node = model.getNodeById(paneId);
  return node._attributes.name;
};

export default paneNameSelector;
