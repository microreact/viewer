import { createKeyedStateSelector } from "../../utils/state";

import labelColumnSelector from "./label-column";
import rowsSelector from "../datasets/rows";

const rowsByLabelSelector = createKeyedStateSelector(
  (state) => rowsSelector(state),
  (state, treeId) => labelColumnSelector(state, treeId),
  (
    rows,
    labelColumn,
  ) => {
    if (!labelColumn) {
      return undefined;
    }

    const rowsByLabel = new Map();

    for (const row of rows) {
      const label = row[labelColumn.name]?.toString();
      if (label) {
        const array = rowsByLabel.get(label) || [];
        array.push(row);
        rowsByLabel.set(label, array);
      }
    }

    return rowsByLabel;
  },
);

export default rowsByLabelSelector;
