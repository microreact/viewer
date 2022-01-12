import { createSelector } from "reselect";
import { sortComparator } from "../../utils/arrays";
import { toText } from "../../utils/text";

import dataColumnByFieldSelector from "../datasets/data-column-by-field";
import uniqueValuesSelector from "../datasets/unique-values";
import activeRowsWithStyleFieldsSelector from "../filters/active-rows-with-style-fields";
import selectedRowsSelector from "../filters/selected-rows";
import colourMapForFieldSelector from "./colour-map-for-field";

function isSelected(rows, field, value) {
  for (const row of rows) {
    if (row[field] === value) {
      return true;
    }
  }
  return false;
}

// const coloursLegendEntriesSelector = createSelector(
//   (state) => activeRowsWithStyleFieldsSelector(state),
//   (state, field) => dataColumnByFieldSelector(state, field),
//   (state, field) => colourMapForFieldSelector(state, field),
//   (state) => selectedRowsSelector(state),
//   (
//     { rows },
//     dataColumn,
//     colourMap,
//     selectedRows,
//   ) => {
//     const entries = [];

//     if (colourMap.scale === "discrete") {
//       for (const [ value, colour ] of colourMap.entries()) {
//         entries.push({
//           colour,
//           value,
//           label: toText(
//             dataColumn.dataType,
//             value,
//           ),
//           isSelected: (selectedRows) && isSelected(selectedRows, dataColumn.name, value),
//         });
//       }

//       // order the list of groups by label
//       entries.sort(sortComparator("label"));
//     }

//     else if (colourMap.scale === "binned") {
//       for (let index = 1; index <= colourMap.numberOfBins; index++) {
//         const start = colourMap.domain[0] + colourMap.binLength * (index - 1);
//         const end = colourMap.domain[0] + colourMap.binLength * index;
//         entries.push({
//           colour: colourMap.colourGetter(index),
//           value: [ start, end ],
//           label: `${toText(dataColumn.dataType, start.toFixed(2))} - ${toText(dataColumn.dataType, end.toFixed(2))}`,
//         });
//       }
//     }

//     else if (colourMap.scale === "continuous") {
//       entries.push({
//         colour: colourMap.range[0],
//         value: colourMap.domain[0],
//         label: toText(dataColumn.dataType, colourMap.domain[0]),
//       });
//       entries.push({
//         colour: colourMap.range[1],
//         value: colourMap.domain[1],
//         label: toText(dataColumn.dataType, colourMap.domain[1]),
//       });
//     }

//     return {
//       scale: colourMap.scale,
//       entries,
//     };
//   }
// );

function coloursLegendEntriesSelector(state, field) {
  const colourMap = colourMapForFieldSelector(state, field);
  const dataColumn = dataColumnByFieldSelector(state, field);
  const entries = [];

  if (colourMap.scale === "discrete") {
    const uniqueValues = new Set();
    const selectedRows = selectedRowsSelector(state, field);
    const { rows } = activeRowsWithStyleFieldsSelector(state);
    for (const row of rows) {
      const value = row[field];
      if (!uniqueValues.has(value)) {
        const colour = colourMap.get(value);
        entries.push({
          colour,
          value,
          label: toText(
            dataColumn.dataType,
            value,
          ),
          isSelected: (selectedRows) && isSelected(selectedRows, dataColumn.name, value),
        });
        uniqueValues.add(value);
      }
    }
    entries.sort(sortComparator("label"));
  }

  return {
    scale: colourMap.scale,
    entries,
  };
}

export default coloursLegendEntriesSelector;
