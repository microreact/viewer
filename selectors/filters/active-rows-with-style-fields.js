import { createSelector } from "reselect";

import rowsWithStyleFieldsSelector from "../styles/rows-with-style-fields";
import filteredIdsSelector from "./filtered-ids";
// import selectedIdsSetSelector from "./selected-ids-set";

const activeRowsWithStyleFieldsSelector = createSelector(
  (state) => rowsWithStyleFieldsSelector(state),
  (state) => filteredIdsSelector(state),
  (
    [ styledRows ],
    filteredIds,
  ) => {
    if (filteredIds) {
      const rows = [];
      for (const row of styledRows) {
        const filtered = filteredIds.has(row[0]);
        row["--mr-filtered"] = filtered ? 1 : 0;
        if (filtered) {
          rows.push(row);
        }
      }
      return { rows };
    }
    else {
      for (const row of styledRows) {
        row["--mr-filtered"] = 1;
      }
      return { rows: styledRows };
    }
  },
);

// const activeRowsWithStyleFieldsSelector = createSelector(
//   (state) => activeRowsWithStyleFieldsBaseSelector(state),
//   (state) => selectedIdsSetSelector(state),
//   (
//     [ styledRows ],
//     selectedIds,
//   ) => {
//     if (selectedIds) {
//       for (const row of styledRows) {
//         row["--microreact-selected"] = selectedIds.has(row[0]);
//       }
//       return [ styledRows ];
//     }
//     else {
//       return [ styledRows ];
//     }
//   },
// );

export default activeRowsWithStyleFieldsSelector;
