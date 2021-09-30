import chartStateSelector from "./chart-state";

const chartTypeSelector = (state, chartId) => {
  return chartStateSelector(state, chartId).type;
};

export default chartTypeSelector;
