import dataColumnsByFieldMapSelector from "./data-columns-by-field-map";
import idFieldNameSelector from "./id-field-name";

const idDataFieldSelector = (state) => {
  return dataColumnsByFieldMapSelector(state).get(idFieldNameSelector(state));
};

export default idDataFieldSelector;
