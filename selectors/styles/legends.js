import { createSelector } from "reselect";

import coloursDataColumnSelector from "./colours-data-column";
import shapesDataColumnSelector from "./shapes-data-column";
import allTreesMetadataFieldsSelector from "../trees/all-trees-metadata-fields";
import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";

const legendsSelector = createSelector(
  (state) => coloursDataColumnSelector(state),
  (state) => shapesDataColumnSelector(state),
  (state) => allTreesMetadataFieldsSelector(state),
  (state) => dataColumnsByFieldMapSelector(state),
  (
    colourColumn,
    shapeColumn,
    treesMetadataFields,
    columnsByFieldMapSelector,
  ) => {
    const legends = [];

    if (colourColumn) {
      legends.push({
        field: colourColumn.name,
        title: `Colours by ${columnsByFieldMapSelector.get(colourColumn.name).label}`,
        type: "colours",
        id: `${colourColumn.name}-colours`,
      });
    }

    if (shapeColumn) {
      legends.push({
        field: shapeColumn.name,
        title: `Shapes by ${columnsByFieldMapSelector.get(shapeColumn.name).label}`,
        type: "shapes",
        id: `${colourColumn.name}-shapes`,
      });
    }

    for (const field of treesMetadataFields) {
      if (field !== colourColumn?.name) {
        legends.push({
          field,
          type: "colours",
          title: `Colours by ${columnsByFieldMapSelector.get(field).label}`,
          id: `${field}-colours`,
        });
      }
    }

    return legends;
  }
);

export default legendsSelector;
