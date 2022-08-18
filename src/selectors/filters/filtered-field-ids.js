import { makePredicate } from "../../utils/expressions";
import { createKeyedStateSelector } from "../../utils/state";

import rowsSelector from "../datasets/rows";
import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";
import { ISODateToTimestamp } from "../../utils/datetime";
import dataFieldFilterSelector from "./data-field-filter";

const filteredFieldIdsSelector = createKeyedStateSelector(
  (state) => rowsSelector(state),
  (state) => dataColumnsByFieldMapSelector(state),
  (state, field) => dataFieldFilterSelector(state, field),
  (
    allRows,
    fieldsMap,
    filter,
  ) => {
    if (filter) {
      const dataColumn = fieldsMap.get(filter.field);
      if (dataColumn && filter.value) {
        const intersection = [];
        let filterValue = filter.value;
        if (dataColumn.dataType === "date") {
          filterValue = filterValue.map(ISODateToTimestamp);
        }
        const predicate = makePredicate(filter.operator, filterValue);
        for (const row of allRows) {
          if (predicate(row[dataColumn.name])) {
            intersection.push(row[0]);
          }
        }

        return new Set(intersection);
      }
    }

    return undefined;
  }
);

export default filteredFieldIdsSelector;
