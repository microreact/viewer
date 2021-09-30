import chartStateSelector from "./chart-state";
import coloursDataColumnSelector from "../styles/colours-data-column";
import dataColumnByFieldSelector from "../datasets/data-column-by-field";

const seriesFieldSelector = (state, chartId) => {
  const { seriesField } = chartStateSelector(state, chartId);

  if (seriesField) {
    return dataColumnByFieldSelector(state, seriesField);
  }
  else {
    return coloursDataColumnSelector(state);
  }
};

export default seriesFieldSelector;
