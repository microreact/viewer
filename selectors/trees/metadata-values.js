import { createSelector } from "reselect";

import { emptyArray } from "../../constants";
import { createCombinedStateSelector } from "../../utils/state";

import labelsSelector from "./labels";
import rowsByLabelSelector from "./rows-by-label";
import treeStateSelector from "./tree-state";
import colourMapForFieldSelector from "../styles/colour-map-for-field";
import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";
import configSelector from "../config";

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
  (state) => state.styles.defaultColour,
  (state) => configSelector(state),
  (
    labels,
    rowsByLabel,
    colourMapsByField,
    dataColumnsByFieldMap,
    defaultColour,
    mrConfig,
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

            const colour = (colourMap.get && colourMap.get(row[colourFieldName])) || defaultColour;
            metadata[label][dataColumnLabel] = {
              colour: (colour === "transparent") ? mrConfig.theme.background.main : colour,
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
