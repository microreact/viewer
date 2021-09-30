import GeoJsonPolygonLookup from "geojson-geometries-lookup";

import { createKeyedStateSelector } from "../../utils/state";

import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";
import geojsonLayerDataSelector from "./geojson-layer-data";
import mapStateSelector from "./map-state";
import markersLayerDataSelector from "./markers-layer-data";

const geodataLinkDataFieldSelector = (state, mapId) => {
  const masState = mapStateSelector(state, mapId);
  if (masState?.geodata?.linkField) {
    const fieldsMap = dataColumnsByFieldMapSelector(state);
    return fieldsMap.get(masState.geodata.linkField);
  }
  else {
    return undefined;
  }
};

const rowsByRegionSelector = createKeyedStateSelector(
  (state, mapId) => mapStateSelector(state, mapId).geodata,
  (state, mapId) => geodataLinkDataFieldSelector(state, mapId),
  (state, mapId) => geojsonLayerDataSelector(state, mapId),
  (state, mapId) => markersLayerDataSelector(state, mapId),
  (
    geodata,
    geodataLinkDataField,
    geojson,
    markersLayerData,
  ) => {
    if (!geodata) {
      return undefined;
    }

    const rowsByRegion = {};

    for (const feature of geojson.features) {
      rowsByRegion[feature.properties["mr-region-id"]] = [];
    }

    if (geodata.linkType === "geographic-coordinates") {
      const lookup = new GeoJsonPolygonLookup(geojson);

      for (const marker of markersLayerData) {
        const collection = lookup.getContainers({
          type: "Point",
          coordinates: marker.position,
        });

        for (const feature of collection.features) {
          const regionRows = rowsByRegion[feature.properties["mr-region-id"]];
          for (const row of marker.rows) {
            regionRows.push(row);
          }
        }
      }
    }
    else if (geodata.linkType === "field-property") {
      for (const feature of geojson.features) {
        const propertyValue = feature[geodata.linkPropertyName];
        const regionRows = rowsByRegion[feature.properties["mr-region-id"]];
        if (propertyValue !== undefined) {
          for (const datum of markersLayerData) {
            const rows = datum.rows.filter((x) => x[geodataLinkDataField.name] === propertyValue);
            for (const row of rows) {
              regionRows.push(row);
            }
          }
        }
      }
    }

    return rowsByRegion;
  },
);

export default rowsByRegionSelector;
