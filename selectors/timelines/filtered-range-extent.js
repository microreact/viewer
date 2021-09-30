import boundsSelector from "./bounds";
import fullRangeExtentSelector from "./full-range-extent";

function filteredRangeExtentSelector(state, timelineId) {
  return (
    boundsSelector(state, timelineId)
    ||
    fullRangeExtentSelector(state, timelineId)
  );
}

export default filteredRangeExtentSelector;
