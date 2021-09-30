const styleSelector = (state, timelineId) => {
  return state.timelines[timelineId].style;
};

export default styleSelector;
