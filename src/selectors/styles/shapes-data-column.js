import { createSelector } from "reselect";

import coloursDataColumnSelector from "./colours-data-column";
import dataColumnsSelector from "../datasets/data-columns";
import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";

const shapesDataColumnSelector = createSelector(
  (state) => dataColumnsByFieldMapSelector(state),
  (state) => dataColumnsSelector(state),
  (state) => state.styles.shapesField,
  (state) => coloursDataColumnSelector(state),
  (
    fieldsMap,
    allFields,
    shapeByFieldName,
    colourByDataField,
  ) => {
    if (shapeByFieldName) {
      return fieldsMap.get(shapeByFieldName);
    }
    else if (colourByDataField && colourByDataField.shapePalette) {
      return colourByDataField;
    }
    else {
      return /*allFields.find((x) => !!x.shapePalette) ||*/ undefined;
    }
  },
);

export default shapesDataColumnSelector;
