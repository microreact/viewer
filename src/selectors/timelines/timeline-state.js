function timelineStateSelector(state, timelineId) {
  return state.timelines[timelineId];
}

export default timelineStateSelector;
