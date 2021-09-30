const boundsSelector = (state, timelineId) => {
  return state.timelines[timelineId]?.bounds;
};

export default boundsSelector;
