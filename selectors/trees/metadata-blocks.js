import { createSelector } from "reselect";

import { emptyArray } from "../../constants";

import treeStateSelector from "./tree-state";
import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";

const metadataBlocksSelector = createSelector(
  (state, treeId) => treeStateSelector(state, treeId).blocks || emptyArray,
  (state, treeId) => dataColumnsByFieldMapSelector(state, treeId),
  (
    blocks,
    dataColumnsByFieldMap,
  ) => {
    const labels = [];

    for (const field of blocks) {
      const dataColumn = dataColumnsByFieldMap.get(field);
      if (dataColumn) {
        labels.push(dataColumn.label || dataColumn.name);
      }
    }

    return labels;
  },
);

export default metadataBlocksSelector;
