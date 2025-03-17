import { createKeyedStateSelector } from "../../utils/state";

import geojsonLayerDataSelector from "./geojson-layer-data";
import mapStateSelector from "./map-state";
import regionColoursSelector from "./regions-colours";
import totalRowCountByRegionSelector from "./total-row-count-by-region";

const geojsonLayerStyleSelector = createKeyedStateSelector(
  (state, mapId) => geojsonLayerDataSelector(state, mapId),
  (state, mapId) => regionColoursSelector(state, mapId),
  (state, mapId) => totalRowCountByRegionSelector(state, mapId),
  (state, mapId) => mapStateSelector(state, mapId).showRegionOutlines,
  (state, mapId) => mapStateSelector(state, mapId).regionsColourOpacity,
  (
    geojson,
    { coloursByRegionId },
    totalRowCountByRegion,
    showRegionOutlines,
    regionsColourOpacity,
  ) => {
    const color = {
      property: "mr-region-id",
      stops: [],
    };

    for (const feature of geojson.features) {
      color.stops.push([
        feature.properties["mr-region-id"],
        coloursByRegionId[feature.properties["mr-region-id"]]
        ??
        (totalRowCountByRegion[feature.properties["mr-region-id"]] > 0 ? "lightgray" : undefined)
        ??
        "transparent",
      ]);
    }

    const style = {
      "fill-color": color,
      "fill-opacity": regionsColourOpacity / 100,
      "fill-outline-color": showRegionOutlines ? "rgba(0, 0, 0, 1)" : color,
    };

    if (regionsColourOpacity === 0) {
      style["fill-opacity"] = 1;
      style["fill-color"] = "rgba(0, 0, 0, 0)";
    }

    return style;
  },
);

export default geojsonLayerStyleSelector;
