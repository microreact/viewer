import { createSelector } from "reselect";
import { toText } from "../../utils/text";

import dataColumnByFieldSelector from "../datasets/data-column-by-field";
import colourMapForFieldSelector from "./colour-map-for-field";

const coloursLegendEntriesSelector = createSelector(
  (state, field) => dataColumnByFieldSelector(state, field),
  (state, field) => colourMapForFieldSelector(state, field),
  (
    dataColumn,
    colourMap,
  ) => {
    const entries = [];

    if (colourMap.scale === "discrete") {
      for (const [ value, colour ] of colourMap.entries()) {
        entries.push({
          colour,
          value,
          label: toText(
            dataColumn.dataType,
            value,
          ),
        });
      }

      // order the list of groups by label
      entries.sort((a, b) => {
        if (a.label > b.label) {
          return 1;
        }
        if (a.label < b.label) {
          return -1;
        }
        return 0;
      });
    }

    else if (colourMap.scale === "binned") {
      for (let index = 1; index <= colourMap.numberOfBins; index++) {
        const start = colourMap.domain[0] + colourMap.binLength * (index - 1);
        const end = colourMap.domain[0] + colourMap.binLength * index;
        entries.push({
          colour: colourMap.colourGetter(index),
          value: [ start, end ],
          label: `${toText(dataColumn.dataType, start.toFixed(2))} - ${toText(dataColumn.dataType, end.toFixed(2))}`,
        });
      }
    }

    else if (colourMap.scale === "continuous") {
      entries.push({
        colour: colourMap.range[0],
        value: colourMap.domain[0],
        label: toText(dataColumn.dataType, colourMap.domain[0]),
      });
      entries.push({
        colour: colourMap.range[1],
        value: colourMap.domain[1],
        label: toText(dataColumn.dataType, colourMap.domain[1]),
      });
    }

    return {
      scale: colourMap.scale,
      entries,
    };
  }
);

export default coloursLegendEntriesSelector;
