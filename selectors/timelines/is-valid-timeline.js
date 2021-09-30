import timelineStateSelector from "./timeline-state";

function isValidNetworkSelector(state, timelineId) {
  const timelineState = timelineStateSelector(state, timelineId);
  return timelineState.dataType && (timelineState.yearField || timelineState.valueField);
}

export default isValidNetworkSelector;
