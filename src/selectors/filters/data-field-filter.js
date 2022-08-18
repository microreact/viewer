function dataFieldFilterSelector(state, field) {
  return state.filters.dataFilters.find((x) => x.field === field);
}

export default dataFieldFilterSelector;
