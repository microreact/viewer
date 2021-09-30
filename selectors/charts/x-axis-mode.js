import chartStateSelector from "./chart-state";

const xAxisModeSelector = (state, chartId) => {
  const chartState = chartStateSelector(state, chartId);

  if (!chartState.xAxisField) {
    return "frequency";
  }

  return chartState.xAxisMode ?? "field";

  // if (!chartState.xAxisField && !chartState.yAxisField) {
  //   return "field";
  // }

  // if (chartState.xAxisField && !chartState.yAxisField) {
  //   return "field";
  // }

  // return chartState.xAxisMode ?? "frequency";

  // if (chartState.xAxisField) {
  //   return chartState.xAxisMode ?? "field";
  // }

  // if (chartState.xAxisMode === "frequency" || chartState.xAxisMode === "cumulative-frequency") {
  //   return chartState.xAxisMode;
  // }

  // return "frequency";
};

export default xAxisModeSelector;
