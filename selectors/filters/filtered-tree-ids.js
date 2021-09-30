import { createCombinedStateSelector, createKeyedStateSelector } from "../../utils/state";
import { intersect } from "../../utils/sets";

import rowsByLabelSelector from "../trees/rows-by-label";

function labelsToRowIds(labels, rowsByLabel) {
  const ids = new Set();
  for (const label of labels) {
    for (const row of (rowsByLabel.get(label) || [])) {
      ids.add(row[0]);
    }
  }
  return ids;
}

const treeIdsSelector = createKeyedStateSelector(
  (state, treeId) => state.trees[treeId].ids,
  (state, treeId) => state.trees[treeId].ids && rowsByLabelSelector(state, treeId),
  (
    labels,
    rowsByLabel,
  ) => {
    if (labels && rowsByLabel) {
      return labelsToRowIds(labels, rowsByLabel);
    }
    else {
      return undefined;
    }
  },
);

const subtreeIdsSelector = createKeyedStateSelector(
  (state, treeId) => state.trees[treeId].subtreeIds,
  (state, treeId) => state.trees[treeId].subtreeIds && rowsByLabelSelector(state, treeId),
  (
    labels,
    rowsByLabel,
  ) => {
    if (labels && rowsByLabel) {
      return labelsToRowIds(labels, rowsByLabel);
    }
    else {
      return undefined;
    }
  },
);

const treeActiveIdsSelector = createKeyedStateSelector(
  (state, treeId) => treeIdsSelector(state, treeId),
  (state, treeId) => subtreeIdsSelector(state, treeId),
  (
    ids,
    subtreeIds,
  ) => {
    if (ids) {
      return ids;
    }

    if (subtreeIds) {
      return subtreeIds;
    }

    return undefined;
  }
);

const filteredTreeIdsSelector = createCombinedStateSelector(
  (state) => state.trees,
  treeActiveIdsSelector,
  (sets) => {
    return intersect(sets.filter((x) => x !== undefined));
  },
);

export default filteredTreeIdsSelector;
