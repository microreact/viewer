import { createSelector } from "reselect";
import { toText } from "../../utils/text";

import dataColumnByFieldSelector from "../datasets/data-column-by-field";
import shapeMapByFieldSelector from "./shape-map-by-field";

const shapesLegendEntriesSelector = createSelector(
  (state, field) => dataColumnByFieldSelector(state, field),
  (state, field) => shapeMapByFieldSelector(state, field),
  (
    dataColumn,
    shapesMap,
  ) => {
    // group all rows
    const entries = [];

    for (const [ value, shape ] of shapesMap.entries()) {
      entries.push({
        shape,
        value,
        label: toText(dataColumn.dataType, value),
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
