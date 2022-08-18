import { createSelector } from "reselect";

import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";
import idDataFieldSelector from "../datasets/id-data-field";

const labelsDataColumnSelector = createSelector(
  (state) => dataColumnsByFieldMapSelector(state),
  (state) => idDataFieldSelector(state),
  (state) => state.styles.labelsField,
  (
    fieldsMap,
    idField,
    labelByFieldName,
  ) => {
    if (labelByFieldName) {
      const field = fieldsMap.get(labelByFieldName);
      return field;
    }
    else {
      return idField;
    }
  },
);

export default labelsDataColumnSelector;
