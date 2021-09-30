import chartStateSelector from "./chart-state";

const seriesStackingSelector = (state, chartId) => {
  const chartState = chartStateSelector(state, chartId);
  return chartState.seriesStacking || "off";

  // if (chartState.seriesField) {
  //   return chartState.seriesStacking || "off";
  // }
  // else {
  //   return "off";
  // }
};

export default seriesStackingSelector;
