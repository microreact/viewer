import { connect } from "react-redux";

import ChartPane from "../components/ChartPane.react";

import { selectItem } from "../actions/charts";
import chartDataSelector from "../selectors/charts/chart-data";
import vegaSpecSelector from "../selectors/charts/vega-spec";
import chartTypeSelector from "../selectors/charts/chart-type";
// import seriesFieldSelector from "../selectors/charts/series-field";

const mapStateToProps = (state, { chartId }) => {
  return {
    chartData: chartDataSelector(state, chartId),
    chartType: chartTypeSelector(state, chartId),
    vegaSpec: vegaSpecSelector(state, chartId),
    // seriesDataColumn: seriesFieldSelector(state, chartId),
  };
};

const mapDispatchToProps = (dispatch, { chartId }) => ({
  onSelectItem: (item, merge) => dispatch(selectItem(chartId, item, merge)),
});

export default connect((state, props) => mapStateToProps(state.present, props), mapDispatchToProps)(ChartPane);
