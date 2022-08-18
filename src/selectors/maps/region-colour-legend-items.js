import { createKeyedStateSelector } from "../../utils/state";

import regionColoursMapSelector from "./regions-colours-map";

const regionColourLegendItemsSelector = createKeyedStateSelector(
  (state, mapId) => regionColoursMapSelector(state, mapId),
  (
    regionColoursMap,
  ) => {
    return (
      Object.values(regionColoursMap)
        .sort((a, b) => (a.value - b.value))
    );
  }
);

export default regionColourLegendItemsSelector;
