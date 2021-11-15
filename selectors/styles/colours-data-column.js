import { createSelector } from "reselect";

import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";
import dataColumnsSelector from "../datasets/data-columns";
import idDataFieldSelector from "../datasets/id-data-field";

const coloursDataColumnSelector = createSelector(
  (state) => dataColumnsByFieldMapSelector(state),
  (state) => dataColumnsSelector(state),
  (state) => idDataFieldSelector(state),
  (state) => state.styles.coloursField,
  (
    fieldsMap,
    allFields,
    idField,
    colourByFieldName,
  ) => {
    if (colourByFieldName) {
      const coloursDataColumn = fieldsMap.get(colourByFieldName);
      if (coloursDataColumn) {
        return coloursDataColumn;
      }
    }

    return (
      allFields.find((x) => !!x.colourPalette)
      ||
      allFields.find((x) => (/__autocolou?r$/i).test(x.name))
      ||
      allFields.find((x) => x.name !== idField?.name)
      ||
      allFields[0]
    );
  },
);

export default coloursDataColumnSelector;
