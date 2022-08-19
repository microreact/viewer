import { createSelector } from "reselect";

import filteredMapIdsSelector from "./filtered-map-ids";
import filteredTreesIdsSelector from "./filtered-tree-ids";
import filteredNetworksIdsSelector from "./filtered-network-ids";
import filteredTimelinesIdsSelector from "./filtered-timeline-ids";
import filteredSearchRowIdsSelector from "./filtered-search-ids";

const filteredNonDataIdsSelector = createSelector(
  (state) => filteredMapIdsSelector(state),
  (state) => filteredTreesIdsSelector(state),
  (state) => filteredNetworksIdsSelector(state),
  (state) => filteredTimelinesIdsSelector(state),
  (state) => filteredSearchRowIdsSelector(state),
  (
    mapRowIds,
    treeRowIds,
    networkRowIds,
    timelineRowIds,
    searchRowIds,
  ) => {
    let ids;

    if (mapRowIds && (ids === undefined || mapRowIds.size < ids.size)) {
      ids = mapRowIds;
    }
    if (treeRowIds && (ids === undefined || treeRowIds.size < ids.size)) {
      ids = treeRowIds;
    }
    if (networkRowIds && (ids === undefined || networkRowIds.size < ids.size)) {
      ids = networkRowIds;
    }
    if (timelineRowIds && (ids === undefined || timelineRowIds.size < ids.size)) {
      ids = timelineRowIds;
    }
    if (searchRowIds && (ids === undefined || searchRowIds.size < ids.size)) {
      ids = searchRowIds;
    }

    if (ids) {
      const intersection = new Set();

      for (const id of ids) {
        if (
          (mapRowIds === undefined || mapRowIds.has(id))
          &&
          (treeRowIds === undefined || treeRowIds.has(id))
          &&
          (networkRowIds === undefined || networkRowIds.has(id))
          &&
          (timelineRowIds === undefined || timelineRowIds.has(id))
          &&
          (searchRowIds === undefined || searchRowIds.has(id))
        ) {
          intersection.add(id);
        }
      }

      return intersection;
    }

    // Return undefined to singnal that no active filters are applied
    return undefined;
  },
);

export default filteredNonDataIdsSelector;
