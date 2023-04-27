import ChartDefaultEmbed from "../components/ChartDefaultEmbed";

import { selectItem } from "../actions/charts";
import { connectToPresentState } from "../utils/state";

import chartDataSelector from "../selectors/charts/chart-data";
import chartStateSelector from "../selectors/charts/chart-state";
import defaultSpecSelector from "../selectors/charts/default-spec";

function mapStateToProps(state, { chartId }) {
  const chartState = chartStateSelector(state, chartId);
  return {
    chartData: chartDataSelector(state, chartId),
    defaultSpec: defaultSpecSelector(state, chartId),
  };
}

function mapDispatchToProps(dispatch, { chartId }) {
  return {
    onSelectItem: (item, merge) => dispatch(selectItem(chartId, item, merge)),
  };
}

export default connectToPresentState(
  ChartDefaultEmbed,
  mapStateToProps,
  mapDispatchToProps,
);
