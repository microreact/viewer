import chartStateSelector from "./chart-state";

const seriesStackingSelector = (state, chartId) => {
  const chartState = chartStateSelector(state, chartId);
  return chartState.seriesStacking || "stacked";

};

export default seriesStackingSelector;
