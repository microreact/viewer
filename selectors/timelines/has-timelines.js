const hasTimelinesSelector = (state) => {
  return (
    state.timelines
    &&
    (Object.keys(state.timelines).length > 0)
  );
};

export default hasTimelinesSelector;
