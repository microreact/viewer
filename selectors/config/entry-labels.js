import configSelector from "../config";

const entryLabelsSelector = (state) => {
  const configState = configSelector(state);
  return configState.entryLabels ?? [ "entry", "entries" ];
};

export default entryLabelsSelector;
