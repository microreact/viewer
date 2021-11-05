import { createKeyedStateSelector } from "../../utils/state";

import rowsWithDateFieldSelector from "./rows-with-date-field";
import activeRowsWithStyleFieldsSelector from "../filters/active-rows-with-style-fields";

const dataExtentSelector = createKeyedStateSelector(
  (state, timelineId) => rowsWithDateFieldSelector(state, timelineId),
  (state) => activeRowsWithStyleFieldsSelector(state),
  (
    { dateFieldName },
    { rows },
  ) => {
    if (dateFieldName) {
      let minDate = Number.MAX_SAFE_INTEGER;
      let maxDate = Number.MIN_SAFE_INTEGER;
      for (const row of rows) {
        if (row[dateFieldName]) {
          if (row[dateFieldName] < minDate) {
            minDate = row[dateFieldName];
          }
          if (row[dateFieldName] > maxDate) {
            maxDate = row[dateFieldName];
          }
        }
      }
      return [minDate, maxDate];
    }
    else {
      return null;
    }
  },
);

export default dataExtentSelector;
