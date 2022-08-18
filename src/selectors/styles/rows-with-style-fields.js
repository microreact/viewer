import { createSelector } from "reselect";

import coloursDataColumnSelector from "./colours-data-column";
import labelsDataColumnSelector from "./labels-data-column";
import rowsSelector from "../datasets/rows";
import shapesDataColumnSelector from "./shapes-data-column";
import colourMapForFieldSelector from "./colour-map-for-field";
import shapeMapByFieldSelector from "./shape-map-by-field";

const emptyLabel = " ";

const colourMapSelector = (state) => {
  const colourColumn = coloursDataColumnSelector(state);
  if (colourColumn) {
    return colourMapForFieldSelector(state, colourColumn.name);
  }
  else {
    return undefined;
  }
};

const shapeMapSelector = (state) => {
  const shapesColumn = shapesDataColumnSelector(state);
  if (shapesColumn) {
    return shapeMapByFieldSelector(state, shapesColumn.name);
  }
  else {
    return undefined;
  }
};

const rowsWithStyleFieldsSelector = createSelector(
  (state) => rowsSelector(state),
  (state) => labelsDataColumnSelector(state),
  (state) => coloursDataColumnSelector(state),
  (state) => colourMapSelector(state),
  (state) => state.styles.defaultColour,
  (state) => shapesDataColumnSelector(state),
  (state) => shapeMapSelector(state),
  (state) => state.styles.defaultShape,
  (
    allRows,
    labelByDataField,
    colourByDataField,
    colourMap,
    defaultColour,
    shapeByDataField,
    shapeMap,
    defaultShape,
  ) => {
    for (const row of allRows) {
      row["--microreact-label"] = labelByDataField ? (row[labelByDataField.name]?.toString() || emptyLabel) : emptyLabel;
      row["--microreact-colour"] = defaultColour;
      row["--microreact-shape"] = defaultShape;

      if (colourByDataField) {
        row["--microreact-colour-label"] = row[colourByDataField.name] || "(blank)";
        row["--microreact-colour"] = colourMap.get(row[colourByDataField.name]) || defaultColour;
      }

      if (shapeByDataField) {
        row["--microreact-shape-label"] = row[shapeByDataField.name];
        row["--microreact-shape"] = shapeMap.get(row[shapeByDataField.name]) || defaultShape;
      }
    }

    return [ allRows ];
  },
);

export default rowsWithStyleFieldsSelector;
