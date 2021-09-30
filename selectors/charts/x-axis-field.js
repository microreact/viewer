import { createKeyedStateSelector } from "../../utils/state";

import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";
import chartStateSelector from "./chart-state";

const xAxisFieldSelector = createKeyedStateSelector(
  (state) => dataColumnsByFieldMapSelector(state),
  (state, chartId) => chartStateSelector(state, chartId).xAxisField,
  (fieldsMap, xAxisField) => {
    if (xAxisField) {
      return fieldsMap.get(xAxisField);
    }
    else {
      return undefined;
    }
  }
);

export default xAxisFieldSelector;
