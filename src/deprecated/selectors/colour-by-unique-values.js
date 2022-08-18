import { emptyArray } from "../../constants";

import colourByDataFieldSelector from "./colour-by-data-field";
import uniqueValuesSelector from "../datasets/unique-values";

const colourByUniqueValuesSelector = (state) => {
  const colourField = colourByDataFieldSelector(state);
  if (colourField) {
    return uniqueValuesSelector(state, colourField.name);
  }
  else {
    return emptyArray;
  }
};

export default colourByUniqueValuesSelector;
