import GeoJsonPolygonLookup from "geojson-geometries-lookup";

import { createKeyedStateSelector } from "../../utils/state";

import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";
import rowsSelector from "../datasets/rows";
import geojsonLayerDataSelector from "./geojson-layer-data";
import mapStateSelector from "./map-state";
import markersLayerDataSelector from "./markers-layer-data";

const totalRowCountByRegionSelector = createKeyedStateSelector(
  (state, mapId) => mapStateSelector(state, mapId).geodata,
  (state, mapId) => geojsonLayerDataSelector(state, mapId),
  (state, mapId) => markersLayerDataSelector(state, mapId),
  (state) => rowsSelector(state),
  (state) => dataColumnsByFieldMapSelector(state),
  (
    geodata,
    geojson,
    markersLayerData,
    allRows,
    dataColumnsByFieldMap,
  ) => {
    if (!geodata) {
      return undefined;
    }

    const rowCountByRegion = {};

    if (geodata.linkType === "geographic-coordinates") {
      for (const feature of geojson.features) {
        rowCountByRegion[feature.properties["mr-region-id"]] = 0;
      }

      const lookup = new GeoJsonPolygonLookup(geojson);

      for (const marker of markersLayerData) {
        const collection = lookup.getContainers({
          type: "Point",
          coordinates: marker.position,
        });

        for (const feature of collection.features) {
          rowCountByRegion[feature.properties["mr-region-id"]] += marker.rows.length;
        }
      }
    }
    else if (geodata.linkType === "field-property") {
      const geodataLinkDataField = dataColumnsByFieldMap.get(geodata.linkField);
      if (geodata.linkField && geodata.linkPropertyName && geodataLinkDataField) {
        // Group data rows by geodata linked column to speed up lookups
        const rowsByLinkedColumn = {};
        for (const row of allRows) {
          const value = row[geodataLinkDataField.name];
          rowsByLinkedColumn[value] ??= [];
          rowsByLinkedColumn[value].push(row);
        }

        for (const feature of geojson.features) {
          const propertyValue = feature.properties[geodata.linkPropertyName];

          rowCountByRegion[feature.properties["mr-region-id"]] = rowsByLinkedColumn[propertyValue]?.length ?? 0;
        }
      }
    }

    return rowCountByRegion;
  },
);

export default totalRowCountByRegionSelector;
