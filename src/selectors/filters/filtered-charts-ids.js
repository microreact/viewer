import * as Sets from "../../utils/sets";
import { createCombinedStateSelector } from "../../utils/state";

import filteredChartIdsSelector from "./filtered-chart-ids";

const filteredChartsIdsSelector = createCombinedStateSelector(
  (state) => state.filters.chartFilters.map((x) => x.chartId),
  filteredChartIdsSelector,
  (sets) => {
    return Sets.intersect(sets.filter((x) => x !== undefined));
  },
);

export default filteredChartsIdsSelector;
