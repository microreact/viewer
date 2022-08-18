import { createKeyedStateSelector } from "../../utils/state";

import geojsonLayerDataSelector from "./geojson-layer-data";
import mapStateSelector from "./map-state";
import regionColoursMapSelector from "./regions-colours-map";

const geojsonLayerStyleSelector = createKeyedStateSelector(
  (state, mapId) => geojsonLayerDataSelector(state, mapId),
  (state, mapId) => regionColoursMapSelector(state, mapId),
  (state, mapId) => mapStateSelector(state, mapId).showRegionOutlines,
  (state, mapId) => mapStateSelector(state, mapId).regionsColourOpacity,
  (
    geojson,
    regionColours,
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
        regionColours[feature.properties["mr-region-id"]]?.colour ?? "transparent",
      ]);
    }

    const style = {
      "fill-color": color,
      "fill-opacity": regionsColourOpacity / 100,
      "fill-outline-color": showRegionOutlines ? "rgba(0, 0, 0, 1)" : color,
    };

    if (regionsColourOpacity === 0) {
      style["fill-opacity"] = 100;
      style["fill-color"] = "rgba(0, 0, 0, 0)";
    }

    return style;
  },
);

export default geojsonLayerStyleSelector;
