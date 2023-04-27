import ChartDefaultEmbed from "../components/ChartDefaultEmbed";

import { selectItem } from "../actions/charts";
import { connectToPresentState } from "../utils/state";

import chartDataSelector from "../selectors/charts/chart-data";
import chartStateSelector from "../selectors/charts/chart-state";
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
    chartData: chartDataSelector(state, chartId),
    chartType: chartTypeSelector(state, chartId),
    facetField: chartState.facetField,
    facetGridColumns: chartState.facetGridColumns,
    facetGridRows: chartState.facetGridRows,
    facetOrder: chartState.facetOrder,
    interpolate: chartState.interpolate,
    mainAxisEncoding: mainAxisEncodingSelector(state, chartId),
    seriesField: seriesFieldSelector(state, chartId),
    seriesOrder: chartState.seriesOrder ?? "ascending",
    seriesScale: seriesScaleSelector(state, chartId),
    seriesStacking: seriesStackingSelector(state, chartId),
    seriesType: seriesTypeSelector(state, chartId),
    xAxisBins: chartState.xAxisBins,
    xAxisField: xAxisFieldSelector(state, chartId),
    xAxisLabelAngle: chartState.xAxisLabelAngle,
    xAxisLabelLimit: chartState.xAxisLabelLimit,
    xAxisMode: xAxisModeSelector(state, chartId),
    xAxisOrder: chartState.xAxisOrder,
    xAxisType: xAxisTypeSelector(state, chartId),
    yAxisBins: chartState.yAxisBins,
    yAxisField: yAxisFieldSelector(state, chartId),
    yAxisLabelAngle: chartState.yAxisLabelAngle,
    yAxisLabelLimit: chartState.yAxisLabelLimit,
    yAxisMode: yAxisModeSelector(state, chartId),
    yAxisOrder: chartState.yAxisOrder,
    yAxisType: yAxisTypeSelector(state, chartId),
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
