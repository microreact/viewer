import { isPointInPolygon } from "../../utils/geometry";
import { createCombinedStateSelector, createKeyedStateSelector } from "../../utils/state";
import { intersect } from "../../utils/sets";

import rowsWithPositionFieldSelector from "../maps/rows-with-position-field";
import mapStateSelector from "../maps/map-state";
import rowsSelector from "../datasets/rows";

const mapIdsSelector = createKeyedStateSelector(
  (state) => rowsSelector(state),
  (state, mapId) => rowsWithPositionFieldSelector(state, mapId),
  (state, mapId) => mapStateSelector(state, mapId).path,
  (
    rows,
    positionFieldName,
    path,
  ) => {
    if (!positionFieldName) {
      return undefined;
    }

    if (path === null) {
      return undefined;
    }

    // find which markers (and row IDs) are inside the region
    const ids = new Set();
    for (const row of rows) {
      if (row[positionFieldName] && isPointInPolygon(row[positionFieldName], path)) {
        ids.add(row[0]);
      }
    }
    return ids;
  },
);

const mapIds = (state, mapId) => {
  if (mapStateSelector(state, mapId).path) {
    return mapIdsSelector(state, mapId);
  }
  else {
    return undefined;
  }
};

const filteredMapIdsSelector = createCombinedStateSelector(
  (state) => state.maps,
  mapIds,
  (sets) => {
    return intersect(sets.filter((x) => x !== undefined));
  },
);

export default filteredMapIdsSelector;
