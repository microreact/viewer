import { createKeyedStateSelector } from "../../utils/state";

import treeFileSelector from "./tree-file";

const phylocanvasSourceSelector = createKeyedStateSelector(
  (state, treeId) => treeFileSelector(state, treeId)?._content,
  (state, treeId) => state.trees[treeId],
  (
    treeFileContent,
    phylocanvasProps,
  ) => {
    let originalSource = phylocanvasProps?.source;
    while (originalSource?.original) {
      originalSource = originalSource.original;
    }
    const source = (originalSource === treeFileContent) ? phylocanvasProps?.source : treeFileContent;
    return source;
  },
);

export default phylocanvasSourceSelector;
