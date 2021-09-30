import { createKeyedStateSelector } from "../../utils/state";

import labelColumnSelector from "./label-column";
import rowsSelector from "../datasets/rows";

const labelsSelector = createKeyedStateSelector(
  (state) => rowsSelector(state),
  (state, treeId) => labelColumnSelector(state, treeId),
  (
    rows,
    labelColumn,
  ) => {
    const labels = [];

    if (labelColumn) {
      for (const row of rows) {
        if (row[labelColumn.name]) {
          labels.push(row[labelColumn.name]?.toString());
        }
      }
    }

    return labels;
  },
);

export default labelsSelector;
