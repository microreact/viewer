import ChartDefaultEmbed from "../components/ChartDefaultEmbed";

import { selectItem } from "../actions/charts";
import { connectToPresentState } from "../utils/state";

import chartDataSelector from "../selectors/charts/chart-data";
import chartStateSelector from "../selectors/charts/chart-state";
import defaultSpecSelector from "../selectors/charts/default-spec";
import seriesStackingSelector from "../selectors/charts/series-stacking";
import seriesScaleSelector from "../selectors/charts/series-scale-selector";

import xAxisFieldSelector from "../selectors/charts/x-axis-field";
import yAxisFieldSelector from "../selectors/charts/y-axis-field";
import seriesFieldSelector from "../selectors/charts/series-field";
import xAxisTypeSelector from "../selectors/charts/x-axis-type";
import yAxisTypeSelector from "../selectors/charts/y-axis-type";
import seriesTypeSelector from "../selectors/charts/series-type";
import chartTypeSelector from "../selectors/charts/chart-type";
import yAxisModeSelector from "../selectors/charts/y-axis-mode";
import xAxisModeSelector from "../selectors/charts/x-axis-mode";
import mainAxisEncodingSelector from "../selectors/charts/main-axis-encoding";

function mapStateToProps(state, { chartId }) {
  const chartState = chartStateSelector(state, chartId);
  return {
    interpolate: chartState.interpolate,
    xAxisOrder: chartState.xAxisOrder,
    xAxisLabelAngle: chartState.xAxisLabelAngle,
    xAxisLabelLimit: chartState.xAxisLabelLimit,
    xAxisBins: chartState.xAxisBins,
    yAxisOrder: chartState.yAxisOrder,
    yAxisLabelAngle: chartState.yAxisLabelAngle,
    yAxisLabelLimit: chartState.yAxisLabelLimit,
    yAxisBins: chartState.yAxisBins,
    seriesOrder: chartState.seriesOrder ?? "ascending",
    facetField: chartState.facetField,
    facetOrder: chartState.facetOrder,
    facetGridColumns: chartState.facetGridColumns,
    facetGridRows: chartState.facetGridRows,

    chartType: chartTypeSelector(state, chartId),
    mainAxisEncoding: mainAxisEncodingSelector(state, chartId),
    xAxisMode: xAxisModeSelector(state, chartId),
    xAxisField: xAxisFieldSelector(state, chartId),
    xAxisType: xAxisTypeSelector(state, chartId),
    yAxisMode: yAxisModeSelector(state, chartId),
    yAxisField: yAxisFieldSelector(state, chartId),
    yAxisType: yAxisTypeSelector(state, chartId),
    seriesField: seriesFieldSelector(state, chartId),
    seriesType: seriesTypeSelector(state, chartId),

    seriesScale: seriesScaleSelector(state, chartId),
    seriesStacking: seriesStackingSelector(state, chartId),

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
