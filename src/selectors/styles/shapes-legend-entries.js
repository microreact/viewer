import { createSelector } from "reselect";
import { toText } from "../../utils/text";

import dataColumnByFieldSelector from "../datasets/data-column-by-field";
import shapeMapByFieldSelector from "./shape-map-by-field";
import selectedRowsSelector from "../filters/selected-rows";

function isSelected(rows, field, value) {
  for (const row of rows) {
    if (row[field] === value) {
      return true;
    }
  }
  return false;
}

const shapesLegendEntriesSelector = createSelector(
  (state, field) => dataColumnByFieldSelector(state, field),
  (state, field) => shapeMapByFieldSelector(state, field),
  (state) => selectedRowsSelector(state),
  (
    dataColumn,
    shapesMap,
    selectedRows,
  ) => {
    // group all rows
    const entries = [];

    for (const [ value, shape ] of shapesMap.entries()) {
      entries.push({
        shape,
        value,
        label: toText(dataColumn.dataType, value),
        isSelected: (selectedRows) && isSelected(selectedRows, dataColumn.name, value),
      });
    }

    // order the list of groups by label
    return entries.sort((a, b) => {
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

export default shapesLegendEntriesSelector;
