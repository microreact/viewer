import { createSelector } from "reselect";

import coloursDataColumnSelector from "./colours-data-column";
import shapesDataColumnSelector from "./shapes-data-column";
import allTreesMetadataFieldsSelector from "../trees/all-trees-metadata-fields";
import allChartsSeriesFieldsSelector from "../charts/all-chart-series-fields";
import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";

const legendsSelector = createSelector(
  (state) => coloursDataColumnSelector(state),
  (state) => shapesDataColumnSelector(state),
  (state) => allTreesMetadataFieldsSelector(state),
  (state) => allChartsSeriesFieldsSelector(state),
  (state) => dataColumnsByFieldMapSelector(state),
  (
    colourColumn,
    shapeColumn,
    treesMetadataFields,
    chartColourSeriesFields,
    columnsByFieldMapSelector,
  ) => {
    const legends = [];
    const otherColourFields = new Set();

    if (colourColumn) {
      legends.push({
        field: colourColumn.name,
        title: `Colours by ${colourColumn.label}`,
        type: "colours",
        id: `${colourColumn.name}-colours`,
      });
      otherColourFields.add(colourColumn.name);
    }

    if (shapeColumn) {
      legends.push({
        field: shapeColumn.name,
        title: `Shapes by ${shapeColumn.label}`,
        type: "shapes",
        id: `${colourColumn.name}-shapes`,
      });
    }

    for (const field of treesMetadataFields) {
      otherColourFields.add(field);
    }

    for (const field of chartColourSeriesFields) {
      otherColourFields.add(field);
    }

    for (const field of otherColourFields) {
      const dataColumn = columnsByFieldMapSelector.get(field);
      if (dataColumn && field !== colourColumn?.name) {
        legends.push({
          field,
          type: "colours",
          title: `Colours by ${dataColumn.label}`,
          id: `${field}-colours`,
        });
      }
    }

    return legends;
  }
);

export default legendsSelector;
