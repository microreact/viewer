import { createSelector } from "reselect";

import activeRowsWithStyleFieldsSelector from "../filters/active-rows-with-style-fields";

const chartDataSelector = createSelector(
  (state) => activeRowsWithStyleFieldsSelector(state),
  (
    { rows },
  ) => {
    return {
      table: rows,
    };
  },
);

export default chartDataSelector;
