export const addDataset = (file, options) => ({
  type: "MICROREACT VIEWER/ADD DATASET",
  payload: {
    file,
    options,
  },
});

export const setColumnLabel = (datasetId, column, label) => ({
  type: "MICROREACT VIEWER/SET COLUMN LABEL",
  datasetId,
  payload: {
    column,
    label,
  },
});

export const updateDataset = (datasetId, options) => ({
  type: "MICROREACT VIEWER/UPDATE DATASET",
  datasetId,
  payload: options,
});

export const updateInlineDataset = (datasetId, column, value, updater) => ({
  type: "MICROREACT VIEWER/UPDATE INLINE DATASET",
  datasetId,
  payload: {
    column,
    value,
    updater,
  },
});
