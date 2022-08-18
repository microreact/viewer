import mainDatasetConfigSelector from "./main-dataset-config";

const idFieldNameSelector = (state) => {
  const masterDataset = mainDatasetConfigSelector(state);
  return masterDataset && (masterDataset.idFieldName || "--mr-index");
};

export default idFieldNameSelector;
