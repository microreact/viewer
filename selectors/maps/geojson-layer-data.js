import { createKeyedStateSelector } from "../../utils/state";
import geodataFileSelector from "./geodata-file";

const geojsonLayerDataSelector = createKeyedStateSelector(
  (state, mapId) => state.maps[mapId].geodata,
  (state, mapId) => geodataFileSelector(state, mapId)?._content,
  (
    geodata,
    geofileContent,
  ) => {
    if (!geodata) {
      return undefined;
    }

    // if (geodata.format !== "application/geo+json") {
    //   throw new Error(`Invalid geo data format: ${geodata.format}`);
    // }

    if (geofileContent.type !== "FeatureCollection") {
      throw new Error(`Invalid GeoJSON type: ${geofileContent.type}`);
    }

    let index = 0;
    for (const feature of geofileContent.features) {
      feature.properties["mr-region-id"] = index;
      index += 1;
    }

    return { ...geofileContent };
  },
);

export default geojsonLayerDataSelector;
