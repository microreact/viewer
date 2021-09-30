import chartStateSelector from "./chart-state";

const mainAxisEncodingSelector = (state, chartId) => {
  const chartState = chartStateSelector(state, chartId);

  if (!chartState.xAxisField && !chartState.yAxisField) {
    return undefined;
  }

  if (chartState.xAxisField && !chartState.xAxisMode) {
    return "x";
  }

  if (chartState.yAxisField && !chartState.yAxisMode) {
    return "y";
  }

  if (chartState.xAxisField) {
    return "x";
  }

  return undefined;

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

export default mainAxisEncodingSelector;
