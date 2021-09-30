import dataColumnByFieldSelector from "../datasets/data-column-by-field";
import shapePalettesSelector from "./shape-palettes";

import { createKeyedStateSelector } from "../../utils/state";

const shapeMapByFieldSelector = createKeyedStateSelector(
  (state, field) => dataColumnByFieldSelector(state, field),
  (state) => shapePalettesSelector(state),
  (
    dataColumn,
    shapePalettes,
  ) => {
    if (dataColumn && dataColumn.shapePalette) {
      const palette = shapePalettes.find((x) => x.name === dataColumn.shapePalette);
      const shapesMap = new Map(palette.entries);
      return shapesMap;
    }
    else {
      return undefined;
    }
  },
);

export default shapeMapByFieldSelector;
