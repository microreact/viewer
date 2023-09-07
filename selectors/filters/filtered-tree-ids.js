import { createCombinedStateSelector, createKeyedStateSelector } from "../../utils/state";
import { intersect } from "../../utils/sets";
import { labelsToRowIds, newickLabels } from "../../utils/trees";

import rowsByLabelSelector from "../trees/rows-by-label";
import treeFileSelector from "../trees/tree-file";

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

const allLeafIdsSelector = createKeyedStateSelector(
  (state, treeId) => treeFileSelector(state, treeId)?._content,
  (state, treeId) => rowsByLabelSelector(state, treeId),
  (
    treeFileContent,
    rowsByLabel,
  ) => {
    if (treeFileContent && rowsByLabel) {
      const labels = newickLabels(treeFileContent);
      return labelsToRowIds(labels, rowsByLabel);
    }
    else {
      return undefined;
    }
  },
);

const treeActiveIdsSelector = (state, treeId) => {
  const ids = treeIdsSelector(state, treeId);
  if (ids) {
    return ids;
  }

  const subtreeIds = subtreeIdsSelector(state, treeId);
  if (subtreeIds) {
    return subtreeIds;
  }

  if (state.trees[treeId].hideOrphanDataRows) {
    return allLeafIdsSelector(state, treeId);
  }

  return undefined;
};

const filteredTreeIdsSelector = createCombinedStateSelector(
  (state) => state.trees,
  treeActiveIdsSelector,
  (sets) => {
    return intersect(sets.filter((x) => x !== undefined));
  },
);

export default filteredTreeIdsSelector;
