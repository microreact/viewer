import { createSelector } from "reselect";
import { emptyArray } from "../../constants";

import fullDatasetSelector from "../datasets/full-dataset";

const shapePalettesSelector = createSelector(
  (state) => (fullDatasetSelector(state)?.shapePalettes) || emptyArray,
  (state) => state.styles.shapePalettes || emptyArray,
  (
    dataShapePalettes,
    customShapePalettes,
  ) => {
    if (dataShapePalettes || customShapePalettes) {
      return [
        ...dataShapePalettes,
        ...customShapePalettes,
      ];
    }
    else {
      return emptyArray;
    }
  }
);

export default shapePalettesSelector;
