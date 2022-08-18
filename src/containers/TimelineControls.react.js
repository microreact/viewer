import { update, setFilter } from "../actions/timelines";
import { openPaneEditor } from "../actions/ui";

import dataColumnsSelector from "../selectors/datasets/data-columns";
import fullRangeChartDataSelector from "../selectors/timelines/full-range-chart-data";
import filteredRangeExtentSelector from "../selectors/timelines/filtered-range-extent";
import filteredRangeUnitSelector from "../selectors/timelines/filtered-range-unit";

import { connectToPresentState } from "../utils/state";

import Component from "../components/TimelineControls.react";
import configSelector from "../selectors/config";

const mapStateToProps = (state, { timelineId }) => {
  const timelineState = state.timelines[timelineId];
  return {
    chartUnit: filteredRangeUnitSelector(state, timelineId),
    controls: timelineState.controls,
    dataFields: dataColumnsSelector(state),
    fullRangeChartData: fullRangeChartDataSelector(state, timelineId),
    isReadOnly: configSelector(state).readOnly,
    laneField: timelineState.laneField,
    maxNodeSize: 160,
    minNodeSize: 14,
    nodeSize: timelineState.nodeSize,
    silderTemporalRange: filteredRangeExtentSelector(state, timelineId),
    speed: timelineState.speed,
    style: timelineState.style,
    unit: timelineState.unit,
  };
};

const mapDispatchToProps = (dispatch, { timelineId }) => ({
  onBoundsChange: (bounds) => dispatch(setFilter(timelineId, bounds)),
  onControlsChange: (value) => dispatch(update(timelineId, "controls", value)),
  onEditPane: () => dispatch(openPaneEditor(timelineId)),
  onNodeSizeChange: (value) => dispatch(update(timelineId, "nodeSize", value)),
  onSpeedChange: (value) => dispatch(update(timelineId, "speed", value)),
  onStackByFieldChange: (value) => dispatch(update(timelineId, "laneField", value)),
  onStyleChange: (value) => dispatch(update(timelineId, "style", value)),
  onUnitChange: (value) => dispatch(update(timelineId, "unit", value || null)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
