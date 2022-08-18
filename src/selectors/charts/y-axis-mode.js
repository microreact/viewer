import chartStateSelector from "./chart-state";

const yAxisModeSelector = (state, chartId) => {
  const chartState = chartStateSelector(state, chartId);

  if (chartState.yAxisMode) {
    return chartState.yAxisMode;
  }

  if (!chartState.yAxisField) {
    return "frequency";
  }

  return "field";

  // if (!chartState.xAxisField && !chartState.yAxisField) {
  //   return "field";
  // }

  // if (chartState.yAxisField && !chartState.xAxisField) {
  //   return "field";
  // }

  // return chartState.yAxisMode ?? "frequency";


  // if (chartState.yAxisField) {
  //   return chartState.yAxisMode ?? "field";
  // }

  // if (chartState.yAxisMode === "frequency" || chartState.yAxisMode === "cumulative-frequency") {
  //   return chartState.yAxisMode;
  // }

  // return "frequency";
};

export default yAxisModeSelector;
