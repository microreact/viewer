import GeoJsonPolygonLookup from "geojson-geometries-lookup";
import centroid from "@turf/centroid";

import { getGroupedColours } from "../../utils/drawing";
import { createKeyedStateSelector } from "../../utils/state";

import activeRowsWithStyleFieldsSelector from "../filters/active-rows-with-style-fields";

import mapStateSelector from "./map-state";
import geojsonLayerDataSelector from "./geojson-layer-data";
import rowsWithPositionFieldSelector from "./rows-with-position-field";

const markersLayerDataSelector = createKeyedStateSelector(
  (state, mapId) => rowsWithPositionFieldSelector(state, mapId),

  (state, mapId) => mapStateSelector(state, mapId).scaleType,
  (state, mapId) => mapStateSelector(state, mapId).groupMarkersByRegion,
  (state, mapId) => mapStateSelector(state, mapId).geodata?.middlePointPropertyName,
  (state, mapId) => geojsonLayerDataSelector(state, mapId),

  (state) => activeRowsWithStyleFieldsSelector(state),
  (
    positionFieldName,

    scaleType,
    groupMarkersByRegion,
    middlePointPropertyName,
    geojson,

    { rows: activeRows },
  ) => {
    const groupedByPosition = {};

    if (positionFieldName && groupMarkersByRegion) {
      // group all rows by region in order to create
      // one marker per region

      for (const feature of geojson.features) {
        groupedByPosition[feature.properties["mr-region-id"]] = {
          position: feature.properties[middlePointPropertyName] ?? centroid(feature).geometry.coordinates,
          rows: [],
          magnitude: 0,
        };
      }

      const lookup = new GeoJsonPolygonLookup(geojson);

      for (let index = 0; index < activeRows.length; index++) {
        const row = activeRows[index];
        if (row[positionFieldName]) {
          const magnitude = row["--mr-scalar"] ?? 1;

          const featureCollection = lookup.getContainers({
            type: "Point",
            coordinates: row[positionFieldName],
          });

          for (const regionFeature of featureCollection.features) {
            const groupData = groupedByPosition[regionFeature.properties["mr-region-id"]];
            groupData.rows.push(row);
            groupData.magnitude += magnitude;
          }
        }
      }
    }

    else if (positionFieldName) {
      // group all rows by position in order to create
      // one marker for all rows at the same position
      for (let index = 0; index < activeRows.length; index++) {
        const row = activeRows[index];
        if (row[positionFieldName]) {
          const magnitude = row["--mr-scalar"] ?? 1;
          const groupKey = row[positionFieldName].join(",");
          if (!groupedByPosition[groupKey]) {
            groupedByPosition[groupKey] = {
              position: row[positionFieldName],
              rows: [ row ],
              magnitude,
            };
          }
          else {
            groupedByPosition[groupKey].rows.push(row);
            groupedByPosition[groupKey].magnitude += magnitude;
          }
        }
      }
    }

    else {
      return undefined;
    }

    const markers = Object.values(groupedByPosition);

    if (markers.length) {
      let min = Number.MAX_SAFE_INTEGER;
      let max = Number.MIN_SAFE_INTEGER;

      for (const marker of markers) {
        if (marker.rows.length > 0) {
          if (marker.magnitude < min) {
            min = marker.magnitude;
          }
          if (marker.magnitude > max) {
            max = marker.magnitude;
          }

          marker.ratio = 0;

          if (marker.rows.length > 1) {
            for (const row of marker.rows) {
              if (
                row["--microreact-colour"] !== marker.rows[0]["--microreact-colour"]
                ||
                row["--microreact-shape"] !== marker.rows[0]["--microreact-shape"]
              ) {
                marker.slices = getGroupedColours(marker.rows);
                break;
              }
            }
          }
        }
      }

      if (max === min) {
        for (const marker of markers) {
          marker.ratio = 1;
        }
      }
      else if (scaleType === "square") {
        const correction = -min;
        const range = (max + correction) ** 0.5;
        for (const marker of markers) {
          marker.ratio = ((marker.magnitude + correction) ** 0.5) / range;
        }
      }
      else if (scaleType === "logarithmic") {
        let correction = 0;
        if (min <= 0) {
          correction = -min + 1;
        }
        const range = (max + correction) / (min + correction);
        const k = 1 / (range === 1 ? 1 : Math.log10(range));
        const c = 0 - k * Math.log10(min + correction);
        if (range !== 0) {
          for (const marker of markers) {
            marker.ratio = k * Math.log10(marker.magnitude + correction) + c;
          }
        }
      }
      else if (scaleType === "linear") {
        const range = (max - min);
        if (range !== 0) {
          for (const marker of markers) {
            marker.ratio = (marker.magnitude - min) / range;
          }
        }
      }
    }

    return markers;
  },
);

export default markersLayerDataSelector;
