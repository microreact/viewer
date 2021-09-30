import { connectToPresentState } from "../utils/state";
import { update } from "../actions/timelines";
import Component from "../components/TimelinePaneEditor.react";
import dataColumnsSelector from "../selectors/datasets/data-columns";
import timelineStateSelector from "../selectors/timelines/timeline-state";

const mapStateToProps = (state, { timelineId }) => ({
  dataFields: dataColumnsSelector(state),
  timelineState: timelineStateSelector(state, timelineId),
});

const mapDispatchToProps = (dispatch, { timelineId }) => ({
  onTimelinePropChange: (prop, value) => dispatch(update(timelineId, prop, value)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
