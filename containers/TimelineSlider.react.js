import { connect } from "react-redux";

import { setFilter } from "../actions/timelines";

import TimelineSlider from "../components/TimelineSlider.react";
import fullRangeExtentSelector from "../selectors/timelines/full-range-extent";
import filteredRangeExtentSelector from "../selectors/timelines/filtered-range-extent";

const mapStateToProps = (state, { timelineId }) => {
  const dataBounds = fullRangeExtentSelector(state, timelineId);
  return {
    max: dataBounds[1],
    min: dataBounds[0],
    value: filteredRangeExtentSelector(state, timelineId),
  };
};

const mapDispatchToProps = (dispatch, { timelineId }) => ({
  onChange: (bounds) => dispatch(setFilter(timelineId, bounds)),
});

export default connect((state, props) => mapStateToProps(state.present, props), mapDispatchToProps)(TimelineSlider);
