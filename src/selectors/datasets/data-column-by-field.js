import dataColumnsByFieldMapSelector from "./data-columns-by-field-map";

const dataColumnByFieldSelector = (
  (state, field) => dataColumnsByFieldMapSelector(state).get(field)
);

export default dataColumnByFieldSelector;
