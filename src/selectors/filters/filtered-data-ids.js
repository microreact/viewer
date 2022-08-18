import { createCombinedStateSelector } from "../../utils/state";
import { intersect } from "../../utils/sets";
import filteredFieldIdsSelector from "./filtered-field-ids";

const filteredDataIdsSelector = createCombinedStateSelector(
  (state) => state.filters.dataFilters.map((x) => x.field),
  filteredFieldIdsSelector,
  (sets) => {
    return intersect(sets.filter((x) => x !== undefined));
  },
);

export default filteredDataIdsSelector;
