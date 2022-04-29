import { createKeyedStateSelector, createCombinedStateSelector } from "../../utils/state";
import { intersect } from "../../utils/sets";
import { toText } from "../../utils/text";

import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";
import filteredFieldIdsSelector from "../filters/filtered-field-ids";
import rowsSelector from "../datasets/rows";
import filteredNonDataIdsSelector from "../filters/filtered-non-data-ids";

const blankItem = {
  name: undefined,
  label: "(blank)",
};

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
  (state, field) => filteredDataIdsSelector(state, field),
  (_, field) => field,
  (
    fieldsMap,
    rows,
    filteredNonDataIds,
    filteredDataIds,
    field,
  ) => {
    const dataColumn = fieldsMap.get(field);

    const uniqueValues = new Set();

    let hasBlanks = false;

    for (const row of rows) {
      const value = row[dataColumn.name];
      if (value === "" || value === null || value === undefined) {
        hasBlanks = true;
      }
      else if (
        !uniqueValues.has(value.valueOf())
        &&
        (!filteredNonDataIds || filteredNonDataIds.has(row[0]))
        &&
        (!filteredDataIds || filteredDataIds.has(row[0]))
      ) {
        uniqueValues.add(value.valueOf());
      }
    }

    const items = [];

    if (hasBlanks) {
      items.push(blankItem);
    }

    for (const value of Array.from(uniqueValues).sort()) {
      items.push({
        name: value,
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
