import rowsSelector from "../datasets/rows";

import dataColumnSelector from "./data-column";
import slicerStateSelector from "./slicer-state";
import { createKeyedStateSelector } from "../../utils/state";

const chartDataSelector = createKeyedStateSelector(
  (state) => rowsSelector(state),
  (state, slicerId) => dataColumnSelector(state, slicerId),
  (state, slicerId) => slicerStateSelector(state, slicerId).includedValues,
  (state, slicerId) => slicerStateSelector(state, slicerId).dataValues,
  (
    rows,
    dataColumn,
    includedValues,
    dataValues,
  ) => {
    if (includedValues === "custom" && dataValues && dataValues.length > 0) {
      const table = [];
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        if (dataValues.includes(row[dataColumn.name]?.toString())) {
          table.push(row);
        }
      }
      return { table };
    }
    else {
      return { table: rows };
    }
  }
);

export default chartDataSelector;
