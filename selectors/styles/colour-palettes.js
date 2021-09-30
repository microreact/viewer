import { createSelector } from "reselect";
import { emptyArray } from "../../constants";

import { colourRanges } from "../../utils/colours";
import fullDatasetSelector from "../datasets/full-dataset";

const colourPalettesSelector = createSelector(
  (state) => (fullDatasetSelector(state)?.colourPalettes) || emptyArray,
  (state) => state.styles.colourPalettes,
  (
    dataColourPalettes,
    customColourPalettes,
  ) => {
    if (dataColourPalettes || customColourPalettes) {
      const uniqueNames = new Set();
      const allPalettes = [];

      if (customColourPalettes) {
        for (const palette of customColourPalettes) {
          uniqueNames.add(palette.name);
          allPalettes.push(palette);
        }
      }

      if (dataColourPalettes) {
        for (const palette of dataColourPalettes) {
          if (!uniqueNames.has(palette.name)) {
            uniqueNames.add(palette.name);
            allPalettes.push(palette);
          }
        }
      }

      for (const palette of colourRanges) {
        allPalettes.push(palette);
      }

      return allPalettes;
    }
    else {
      return colourRanges;
    }
  }
);

export default colourPalettesSelector;
