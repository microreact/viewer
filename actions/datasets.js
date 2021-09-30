export const addDataset = (file, options) => ({
  type: "MICROREACT VIEWER/ADD DATASET",
  payload: {
    file,
    options,
  },
});

export const updateDataset = (datasetId, options) => ({
  type: "MICROREACT VIEWER/UPDATE DATASET",
  datasetId,
  payload: options,
});
