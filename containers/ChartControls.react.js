import { update, updateMainAxisField } from "../actions/charts";

import chartStateSelector from "../selectors/charts/chart-state";
import dataColumnsSelector from "../selectors/datasets/data-columns";
import dataFileUrlSelector from "../selectors/charts/data-file-url";
import seriesStackingSelector from "../selectors/charts/series-stacking";

import { connectToPresentState } from "../utils/state";

import Component from "../components/ChartControls.react";
import mainAxisEncodingSelector from "../selectors/charts/main-axis-encoding";
import seriesFieldSelector from "../selectors/charts/series-field";

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
    xAxisField: chartState.xAxisField,
    xAxisMode: chartState.xAxisMode,
    xAxisOrder: chartState.xAxisOrder,
    xAxisType: chartState.xAxisType,
    yAxisField: chartState.yAxisField,
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
  onSeriesStackingChange: (value) => dispatch(update(chartId, "seriesStacking", value || "off")),
  onSeriesTypeChange: (value) => dispatch(update(chartId, "seriesType", value)),
  onShowSelecttionChange: (value) => dispatch(update(chartId, "showSelection", value)),
  onSpecChange: (value) => dispatch(update(chartId, "spec", value)),
  onXAxisFieldChage: (value) => dispatch(update(chartId, "xAxisField", value)),
  onXAxisModeChange: (value) => dispatch(update(chartId, "xAxisMode", value)),
  onXAxisOrderChange: (value) => dispatch(update(chartId, "xAxisOrder", value)),
  onXAxisTypeChange: (value) => dispatch(update(chartId, "xAxisType", value)),
  onYAxisFieldChage: (value) => dispatch(update(chartId, "yAxisField", value)),
  onYAxisModeChange: (value) => dispatch(update(chartId, "yAxisMode", value)),
  onYAxisOrderChange: (value) => dispatch(update(chartId, "xAxisOrder", value)),
  onYAxisTypeChange: (value) => dispatch(update(chartId, "yAxisType", value)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
