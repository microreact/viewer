import { update, updateMainAxisField } from "../actions/charts";

import chartStateSelector from "../selectors/charts/chart-state";
import dataColumnsSelector from "../selectors/datasets/data-columns";
import dataFileUrlSelector from "../selectors/charts/data-file-url";
import seriesStackingSelector from "../selectors/charts/series-stacking";

import { connectToPresentState } from "../utils/state";

import Component from "../components/ChartControls.react";
import mainAxisEncodingSelector from "../selectors/charts/main-axis-encoding";
import seriesFieldSelector from "../selectors/charts/series-field";
import xAxisTypeSelector from "../selectors/charts/x-axis-type";
import yAxisTypeSelector from "../selectors/charts/y-axis-type";

const mapStateToProps = (state, { chartId }) => {
  const chartState = chartStateSelector(state, chartId);
  return {
    chartType: chartState.type,
    controls: chartState.controls,
    dataFileUrl: dataFileUrlSelector(state, chartId),
    fullDatasetColumns: dataColumnsSelector(state),
    interpolateType: chartState.interpolate,
    mainAxisEncoding: mainAxisEncodingSelector(state, chartId),
    seriesDataColumn: seriesFieldSelector(state, chartId),
    seriesField: chartState.seriesField,
    seriesOrder: chartState.seriesOrder,
    seriesStacking: seriesStackingSelector(state, chartId),
    seriesType: chartState.seriesType,
    showSelection: chartState.showSelection,
    spec: chartState.spec,
    xAxisAutoType: xAxisTypeSelector(state, chartId),
    xAxisField: chartState.xAxisField,
    xAxisBins: chartState.xAxisBins,
    yAxisBins: chartState.yAxisBins,
    xAxisLabelAngle: chartState.xAxisLabelAngle,
    xAxisMode: chartState.xAxisMode,
    xAxisOrder: chartState.xAxisOrder,
    xAxisType: chartState.xAxisType,
    yAxisAutoType: yAxisTypeSelector(state, chartId),
    yAxisField: chartState.yAxisField,
    yAxisLabelAngle: chartState.yAxisLabelAngle,
    yAxisMode: chartState.yAxisMode,
    yAxisOrder: chartState.yAxisOrder,
    yAxisType: chartState.yAxisType,
  };
};

const mapDispatchToProps = (dispatch, { chartId }) => ({
  onChartTypeChange: (value) => dispatch(update(chartId, "type", value)),
  onControlsChange: (value) => dispatch(update(chartId, "controls", value)),
  onInterpolateChange: (value) => dispatch(update(chartId, "interpolate", value)),
  onMainAxisFieldChange: (name, value) => dispatch(updateMainAxisField(chartId, name, value)),
  onSeriesFieldChage: (value) => dispatch(update(chartId, "seriesField", value)),
  onSeriesOrderChange: (value) => dispatch(update(chartId, "seriesOrder", value)),
  onSeriesStackingChange: (value) => dispatch(update(chartId, "seriesStacking", value)),
  onSeriesTypeChange: (value) => dispatch(update(chartId, "seriesType", value)),
  onShowSelecttionChange: (value) => dispatch(update(chartId, "showSelection", value)),
  onSpecChange: (value) => dispatch(update(chartId, "spec", value)),
  onXAxisBinsChange: (value) => dispatch(update(chartId, "xAxisBins", value)),
  onXAxisFieldChage: (value) => dispatch(update(chartId, "xAxisField", value)),
  onXAxisLabelAngleChange: (value) => dispatch(update(chartId, "xAxisLabelAngle", value)),
  onXAxisModeChange: (value) => dispatch(update(chartId, "xAxisMode", value)),
  onXAxisOrderChange: (value) => dispatch(update(chartId, "xAxisOrder", value)),
  onXAxisTypeChange: (value) => dispatch(update(chartId, "xAxisType", value)),
  onYAxisBinsChange: (value) => dispatch(update(chartId, "yAxisBins", value)),
  onYAxisFieldChage: (value) => dispatch(update(chartId, "yAxisField", value)),
  onYAxisLabelAngleChange: (value) => dispatch(update(chartId, "yAxisLabelAngle", value)),
  onYAxisModeChange: (value) => dispatch(update(chartId, "yAxisMode", value)),
  onYAxisOrderChange: (value) => dispatch(update(chartId, "xAxisOrder", value)),
  onYAxisTypeChange: (value) => dispatch(update(chartId, "yAxisType", value)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
