import { createSelector } from "reselect";

import selectedIdsSetSelector from "../filters/selected-ids-set";
// import activeRowsSelector from "../filters/active-rows";
// import rowStylesSelector from "./row-styles";
// import colourByDataFieldSelector from "./colour-by-data-field";
// import shapeByDataFieldSelector from "./shape-by-data-field";
import activeRowsWithStyleFieldsSelector from "../filters/active-rows-with-style-fields";

const legendItemsSelector = createSelector(
  (state) => activeRowsWithStyleFieldsSelector(state),
  (state) => selectedIdsSetSelector(state),
  // (state) => colourByDataFieldSelector(state),
  // (state) => shapeByDataFieldSelector(state),
  (
    { rows },
    highlightedIds,
    // colourColumn,
    // shapeColumn,
  ) => {
    // group all rows
    const groups = {};

    for (const row of rows) {
      // const style = rowStyles[row[0]];
      const key = `${row["--microreact-shape"]}-${row["--microreact-colour"]}}`;
      if (!groups[key]) {
        groups[key] = {
          style: row,
          labels: new Set(),
          rowIds: [],
        };
      }
      const label = [];
      if (row["--microreact-colour-label"]) {
        label.push(row["--microreact-colour-label"]);
      }
      if (row["--microreact-shape-label"] && row["--microreact-shape-label"] !== row["--microreact-colour-label"]) {
        label.push(row["--microreact-shape-label"]);
      }
      // if (patternColumn && patternColumn !== colourColumn) {
      //   label.push(row[patternColumn.name]);
      // }
      groups[key].labels.add(label.length === 1 ? label[0] : label.join(", "));
      groups[key].rowIds.push(row[0]);
    }

    // sort and join the labels of each group
    const list = (
      Object
        .keys(groups)
        .map((key) => {
          const group = groups[key];
          const labels = Array.from(group.labels);
          group.label = (labels.length === 1) ? labels[0] : labels.join("\n");
          group.isHighlighted = group.rowIds.some((id) => highlightedIds.has(id));
          return group;
        })
    );

    // order the list of groups by label
    return list.sort((a, b) => {
      if (a.label > b.label) {
        return 1;
      }
      if (a.label < b.label) {
        return -1;
      }
      return 0;
    });
  }
);

export default legendItemsSelector;
