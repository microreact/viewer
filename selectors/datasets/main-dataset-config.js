const mainDatasetConfigSelector = (state) => {
  const datasetIds = Object.keys(state.datasets);

  if (datasetIds.length === 1) {
    state.datasets[datasetIds[0]].id = datasetIds[0];
    return state.datasets[datasetIds[0]];
  }

  for (const datasetId of datasetIds) {
    const dataset = state.datasets[datasetId];
    if ("idFieldName" in dataset) {
      dataset.id = datasetId;
      return dataset;
    }
  }

  return undefined;
};

export default mainDatasetConfigSelector;
