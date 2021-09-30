import { emptyArray } from "../../constants";

import treeStateSelector from "./tree-state";

const metadataFieldsSelector = (
  (state, treeId) => treeStateSelector(state, treeId).blocks || emptyArray
);

export default metadataFieldsSelector;
