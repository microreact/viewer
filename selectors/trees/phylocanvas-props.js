import { createKeyedStateSelector } from "../../utils/state";

import filteredIdsSelector from "../filters/filtered-ids";
import labelsDataColumnSelector from "../styles/labels-data-column";
import labelsSelector from "./labels";
import metadataValuesSelector from "./metadata-values";
import paneSizeSelector from "../panes/pane-size";
import rowsByLabelSelector from "./rows-by-label";
import rowStylesSelector from "../styles/row-styles";
import selectedIdsListSelector from "../filters/selected-ids-list";
import configSelector from "../config";
import metadataBlocksSelector from "./metadata-blocks";
import treeFileSelector from "./tree-file";

const noShape = false;

const nodeStylesSelector = createKeyedStateSelector(
  (state, treeId) => labelsSelector(state, treeId),
  (state) => rowStylesSelector(state),
  (state, treeId) => rowsByLabelSelector(state, treeId),
  (state) => filteredIdsSelector(state),
  (
    labels,
    [ rowStyles ],
    rowsByLabel,
    filteredIds,
  ) => {
    const nodeStyles = {};

    for (const label of labels) {
      const labelRows = rowsByLabel.get(label);
      const rowStyle = rowStyles[labelRows[0][0]];
      const isActive = (!filteredIds || labelRows.some((row) => filteredIds.has(row[0])));
      nodeStyles[label] = {
        fillColour: rowStyle.colour,
        strokeColour: rowStyle.colour,
        shape: isActive ? rowStyle.shape : noShape,
        label: rowStyle.label,
      };
    }

    return nodeStyles;
  },
);

const phylocanvasPropsSelector = createKeyedStateSelector(
  (_, treeId) => treeId,
  (state, treeId) => treeFileSelector(state, treeId)?._content,
  (state, treeId) => state.trees[treeId],
  (state, treeId) => nodeStylesSelector(state, treeId),
  (state, treeId) => paneSizeSelector(state, treeId),
  (state, treeId) => metadataBlocksSelector(state, treeId),
  (state, treeId) => metadataValuesSelector(state, treeId),
  (state) => selectedIdsListSelector(state),
  (state) => labelsDataColumnSelector(state),
  (state) => configSelector(state),
  (
    treeId,
    treeFileContent,
    phylocanvasProps,
    styles,
    size,
    metadataBlocks,
    metadataValues,
    selectedIds,
    labelsDataColumn,
    defaults,
  ) => {
    let originalSource = phylocanvasProps?.source;
    while (originalSource?.original) {
      originalSource = originalSource.original;
    }
    const source = (originalSource === treeFileContent) ? phylocanvasProps?.source : treeFileContent;

    return {
      ...phylocanvasProps,
      blocks: metadataBlocks,
      fontFamily: defaults.fontFamily,
      id: treeId,
      interactive: true,
      labelField: (labelsDataColumn) ? labelsDataColumn.label : null,
      metadata: metadataValues,
      nodeShape: false,
      padding: 32,
      scalebar: true,
      selectedIds,
      shapeBorderAlpha: 0.56,
      size,
      source,
      strokeColour: "#222",
      styles,
    };
  },
);

export default phylocanvasPropsSelector;
