import { createSelector } from "reselect";

// import activeRowsSelector from "../filters/active-rows";
import activeRowsWithStyleFieldsSelector from "../filters/active-rows-with-style-fields";
// import chartStateSelector from "./chart-state";
// import selectedRowsSelector from "../filters/selected-rows";
// import selectedIdsListSelector from "../filters/selected-ids-list";

// const dataSelector = (state, chartId) => {
//   if (chartStateSelector(state, chartId).showSelection) {
//     return selectedRowsSelector(state) ?? activeRowsSelector(state);
//   }
//   return activeRowsSelector(state);
// };

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
