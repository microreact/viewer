import GeoJsonPolygonLookup from "geojson-geometries-lookup";

import { createKeyedStateSelector } from "../../utils/state";

import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";
import activeRowsWithStyleFieldsSelector from "../filters/active-rows-with-style-fields";
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
  (state) => activeRowsWithStyleFieldsSelector(state),
  (
    geodata,
    geodataLinkDataField,
    geojson,
    markersLayerData,
    { rows: activeRows },
  ) => {
    if (!geodata) {
      return undefined;
    }

    const rowsByRegion = {};

    if (geodata.linkType === "geographic-coordinates") {
      for (const feature of geojson.features) {
        rowsByRegion[feature.properties["mr-region-id"]] = [];
      }

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
      // Group data rows by geodata linked column to speed up lookups
      const rowsByLinkedColumn = {};
      for (const row of activeRows) {
        const value = row[geodataLinkDataField.name];
        rowsByLinkedColumn[value] ??= [];
        rowsByLinkedColumn[value].push(row);
      }

      for (const feature of geojson.features) {
        const propertyValue = feature.properties[geodata.linkPropertyName];

        rowsByRegion[feature.properties["mr-region-id"]] = rowsByLinkedColumn[propertyValue] ?? [];
      }
    }

    return rowsByRegion;
  },
);

export default rowsByRegionSelector;
