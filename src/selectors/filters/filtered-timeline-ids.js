import { createCombinedStateSelector, createKeyedStateSelector } from "../../utils/state";
import { intersect } from "../../utils/sets";

import boundsSelector from "../timelines/bounds";
import rowsSelector from "../datasets/rows";
import rowsWithDateFieldSelector from "../timelines/rows-with-date-field";

const timelineActiveIds = createKeyedStateSelector(
  (state, timelineId) => rowsWithDateFieldSelector(state, timelineId),
  (state, timelineId) => boundsSelector(state, timelineId),
  (state) => rowsSelector(state),
  (
    { dateFieldName },
    bounds,
    rows,
  ) => {
    if (!bounds) {
      return undefined;
    }

    const [ lowerTimestamp, upperTimestamp ] = bounds;

    // find which data points (and row IDs) are inside the filter interval
    const ids = new Set();
    for (const row of rows) {
      const timestamp = row[dateFieldName]?.valueOf();
      if (timestamp && timestamp >= lowerTimestamp && timestamp <= upperTimestamp) {
        ids.add(row[0]);
      }
    }

    return ids;
  }
);

const filteredTimelineIdsSelector = createCombinedStateSelector(
  (state) => state.timelines,
  timelineActiveIds,
  (sets) => {
    return intersect(sets.filter((x) => x !== undefined));
  },
);

export default filteredTimelineIdsSelector;
