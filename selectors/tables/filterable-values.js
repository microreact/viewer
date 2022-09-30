import { createKeyedStateSelector, createCombinedStateSelector } from "../../utils/state";
import { intersect } from "../../utils/sets";
import { toText } from "../../utils/text";

import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";
import filteredFieldIdsSelector from "../filters/filtered-field-ids";
import rowsSelector from "../datasets/rows";
import filteredNonDataIdsSelector from "../filters/filtered-non-data-ids";
import filteredChartsIdsSelector from "../filters/filtered-charts-ids";

const filteredDataIdsSelector = createCombinedStateSelector(
  (state, field) => state.filters.dataFilters.map((x) => x.field).filter((x) => x !== field),
  filteredFieldIdsSelector,
  (sets) => {
    return intersect(sets.filter((x) => x !== undefined));
  },
);

const filterableValuesSelector = createKeyedStateSelector(
  (state) => dataColumnsByFieldMapSelector(state),
  (state) => rowsSelector(state),
  (state) => filteredNonDataIdsSelector(state),
  (state) => filteredChartsIdsSelector(state),
  (state, field) => filteredDataIdsSelector(state, field),
  (_, field) => field,
  (
    fieldsMap,
    rows,
    filteredNonDataIds,
    chartRowIds,
    filteredDataIds,
    field,
  ) => {
    const dataColumn = fieldsMap.get(field);

    const countByValue = new Map();
    let blankCount = 0;

    for (const row of rows) {
      const value = row[dataColumn.name];
      if (
        (!filteredNonDataIds || filteredNonDataIds.has(row[0]))
        &&
        (!chartRowIds || chartRowIds.has(row[0]))
        &&
        (!filteredDataIds || filteredDataIds.has(row[0]))
      ) {
        if (value === "" || value === null || value === undefined) {
          blankCount += 1;
        }
        else {
          countByValue.set(
            value.valueOf(),
            (countByValue.get(value.valueOf()) ?? 0) + 1,
          );
        }
      }
    }

    const items = [];

    if (blankCount > 0) {
      items.push({
        value: undefined,
        count: blankCount,
        label: "(blank)",
      });
    }

    for (const value of Array.from(countByValue.keys()).sort()) {
      items.push({
        value,
        count: countByValue.get(value),
        label: toText(
          dataColumn.dataType,
          value,
        ),
      });
    }

    return items;
  },
);

export default filterableValuesSelector;
