import { createSelector } from "reselect";
import { emptyArray } from "../../constants";
import coloursDataColumnSelector from "../styles/colours-data-column";
import activeRowsWithStyleFieldsSelector from "./active-rows-with-style-fields";
import selectedRowsSelector from "./selected-rows";

const selectionChartDataSelector = createSelector(
  (state) => selectedRowsSelector(state),
  (state) => coloursDataColumnSelector(state),
  (state) => activeRowsWithStyleFieldsSelector(state),
  (
    selectedRows,
    coloursDataColumn,
  ) => {
    const rows = [
      {"category": 1, "value": 4},
      {"category": 2, "value": 6},
      {"category": 3, "value": 10},
      {"category": 4, "value": 3},
      {"category": 5, "value": 7},
      {"category": 6, "value": 8}
    ];
    return {
      table: selectedRows ?? emptyArray,
      // table2: [
      //   {"category": 1, "value": 4},
      //   {"category": 2, "value": 6},
      // ],
    };
  }
);

export default selectionChartDataSelector;
