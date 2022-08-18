import { createKeyedStateSelector } from "../../utils/state";

import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";
import chartStateSelector from "./chart-state";

const yAxisFieldSelector = createKeyedStateSelector(
  (state) => dataColumnsByFieldMapSelector(state),
  (state, chartId) => chartStateSelector(state, chartId).yAxisField,
  (fieldsMap, yAxisField) => {
    if (yAxisField) {
      return fieldsMap.get(yAxisField);
    }
    else {
      return undefined;
    }
  },
);

export default yAxisFieldSelector;
