import { createSelector } from "reselect";

import { emptyArray } from "../../constants";
import { createCombinedStateSelector } from "../../utils/state";

import labelsSelector from "./labels";
import rowsByLabelSelector from "./rows-by-label";
import treeStateSelector from "./tree-state";
import colourMapForFieldSelector from "../styles/colour-map-for-field";
import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";

const colourMapsByFieldSelector = createCombinedStateSelector(
  (state, treeId) => treeStateSelector(state, treeId).blocks || emptyArray,
  colourMapForFieldSelector,
  (
    valueToColourMaps,
    keys,
  ) => {
    const colourMapsByField = {};
    for (let index = 0; index < keys.length; index++) {
      colourMapsByField[keys[index]] = valueToColourMaps[index];
    }
    return colourMapsByField;
  },
);

const metadataValuesSelector = createSelector(
  (state, treeId) => labelsSelector(state, treeId),
  (state, treeId) => rowsByLabelSelector(state, treeId),
  (state, treeId) => colourMapsByFieldSelector(state, treeId),
  (state, treeId) => dataColumnsByFieldMapSelector(state, treeId),
  (
    labels,
    rowsByLabel,
    colourMapsByField,
    dataColumnsByFieldMap,
  ) => {
    const metadata = {};

    for (const label of labels) {
      metadata[label] = {};
    }

    for (const label of labels) {
      const labelRows = rowsByLabel.get(label);
      if (labelRows && labelRows.length) {
        const row = labelRows[0];
        for (const colourFieldName of Object.keys(colourMapsByField)) {
          const dataColumn = dataColumnsByFieldMap.get(colourFieldName);
          if (dataColumn) {
            const dataColumnLabel = dataColumn.label || dataColumn.name;
            const colourMap = colourMapsByField[colourFieldName];

            metadata[label][dataColumnLabel] = {
              colour: (colourMap.get && colourMap.get(row[colourFieldName])) || "transparent",
              label: row[colourFieldName],
            };
          }
        }
      }
    }

    return metadata;
  },
);

export default metadataValuesSelector;
