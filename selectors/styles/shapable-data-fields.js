import { createSelector } from "reselect";

import dataColumnsSelector from "../datasets/data-columns";

const shapableDataFieldsSelector = createSelector(
  (state) => dataColumnsSelector(state),
  (
    allFields,
  ) => {
    return allFields.filter((x) => !!x.shapePalette);
  },
);

export default shapableDataFieldsSelector;
