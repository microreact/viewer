import TimelinePane from "../components/TimelinePane.react";

import { applyTimelineFilter, selectItem, setFilter } from "../actions/timelines";
import filteredRangeExtentSelector from "../selectors/timelines/filtered-range-extent";
import filteredRangeUnitSelector from "../selectors/timelines/filtered-range-unit";
import { connectToPresentState } from "../utils/state";
// import chartDataSelector from "../selectors/timelines/chart-data";
// import chartSpecSelector from "../selectors/timelines/chart-spec";

const mapStateToProps = (state, { timelineId }) => {
  return {
    bounds: filteredRangeExtentSelector(state, timelineId),
    unit: filteredRangeUnitSelector(state, timelineId),
  };
};

const mapDispatchToProps = (dispatch, { timelineId }) => ({
  onTimelineFilter: (filter) => dispatch(applyTimelineFilter(timelineId, filter)),
  onSelectItem: (item, merge) => dispatch(selectItem(timelineId, item, merge)),
  onChange: (bounds) => dispatch(setFilter(timelineId, bounds)),
});

export default connectToPresentState(
  TimelinePane,
  mapStateToProps,
  mapDispatchToProps,
);
