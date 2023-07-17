import { connect } from "react-redux";

import TimelinePane from "../components/TimelinePane.react";

import { selectItem, setFilter } from "../actions/timelines";
import filteredRangeExtentSelector from "../selectors/timelines/filtered-range-extent";
import filteredRangeUnitSelector from "../selectors/timelines/filtered-range-unit";
// import chartDataSelector from "../selectors/timelines/chart-data";
// import chartSpecSelector from "../selectors/timelines/chart-spec";

const mapStateToProps = (state, { timelineId }) => {
  return {
    bounds: filteredRangeExtentSelector(state, timelineId),
    unit: filteredRangeUnitSelector(state, timelineId),
  };
};

const mapDispatchToProps = (dispatch, { timelineId }) => ({
  onSelectItem: (item, merge) => dispatch(selectItem(timelineId, item, merge)),
  onChange: (bounds) => dispatch(setFilter(timelineId, bounds)),
});

export default connect((state, props) => mapStateToProps(state.present, props), mapDispatchToProps)(TimelinePane);
