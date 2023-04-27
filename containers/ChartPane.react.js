import { selectItem } from "../actions/charts";

import chartTypeSelector from "../selectors/charts/chart-type";
import chartStateSelector from "../selectors/charts/chart-state";

import { connectToPresentState } from "../utils/state";

import ChartPane from "../components/ChartPane.react";

const mapStateToProps = (state, { chartId }) => {
  const chartState = chartStateSelector(state, chartId);

  return {
    chartType: chartTypeSelector(state, chartId),
  };
};

const mapDispatchToProps = (dispatch, { chartId }) => ({
  onSelectItem: (item, merge) => dispatch(selectItem(chartId, item, merge)),
});

export default connectToPresentState(
  ChartPane,
  mapStateToProps,
  mapDispatchToProps,
);
