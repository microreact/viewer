import GeoJsonPolygonLookup from "geojson-geometries-lookup";
import centroid from "@turf/centroid";

import { getGroupedColours } from "../../utils/drawing";
import { createKeyedStateSelector } from "../../utils/state";

import filteredIdsSelector from "../filters/filtered-ids";
import mapDataSelector from "./map-data";
import rowStylesSelector from "../styles/row-styles";
import mapStateSelector from "./map-state";
import scaleMarkersFieldSelector from "./scale-markers-field";
import geojsonLayerDataSelector from "./geojson-layer-data";

const groupedDataSelector = createKeyedStateSelector(
  (state, mapId) => mapStateSelector(state, mapId).groupMarkersByRegion,
  (state, mapId) => mapStateSelector(state, mapId).geodata?.middlePointPropertyName,
  (state, mapId) => mapDataSelector(state, mapId),
  (state, mapId) => geojsonLayerDataSelector(state, mapId),
  (
    groupMarkersByRegion,
    middlePointPropertyName,
    mapData,
    geojson,
  ) => {
    if (groupMarkersByRegion) {
      const groupedData = {};

    console.time(`groupedDataSelector`)

      for (const feature of geojson.features) {
        groupedData[feature.properties["mr-region-id"]] = {
          position: feature.properties[middlePointPropertyName] ?? centroid(feature).geometry.coordinates,
          rows: [],
        };
      }

      const lookup = new GeoJsonPolygonLookup(geojson);

      for (const datum of mapData) {
        const collection = lookup.getContainers({
          type: "Point",
          coordinates: datum.position,
        });

        for (const regionFeature of collection.features) {
          const groupData = groupedData[regionFeature.properties["mr-region-id"]];
          for (const row of datum.rows) {
            groupData.rows.push(row);
          }
        }
      }

    console.timeEnd(`groupedDataSelector`)

      return Object.values(groupedData);
    }
    else {
      return mapData;
    }
  },
);

const mapMarkersSelector = createKeyedStateSelector(
  (state, mapId) => groupedDataSelector(state, mapId),
  (state) => rowStylesSelector(state),
  (state) => filteredIdsSelector(state),
  (state, mapId) => mapStateSelector(state, mapId).scaleType,
  (state, mapId) => scaleMarkersFieldSelector(state, mapId),
  (
    groupedData,
    [ rowStyles ],
    filteredIds,
    scaleType,
    scaleByField,
  ) => {
    const activeMarkerData = [];

    console.time(`mapMarkersSelector`)

    if (groupedData) {
      let min = Number.MAX_SAFE_INTEGER;
      let max = Number.MIN_SAFE_INTEGER;
      for (const group of groupedData) {
        const rows = (
          filteredIds ?
            group.rows.filter((row) => filteredIds.has(row[0])) :
            group.rows
        );
        if (rows.length > 0) {
          const magnitude =
            (scaleByField)
              ?
              rows.reduce(
                (total, row) => (total + (parseFloat(row[scaleByField.name]) || 0)),
                0
              ) :
              rows.length;
          if (magnitude < min) {
            min = magnitude;
          }
          if (magnitude > max) {
            max = magnitude;
          }

          if (rows.length === 1) {
            activeMarkerData.push({
              rows,
              position: group.position,
              style: rowStyles[rows[0][0]],
              ratio: 0,
              magnitude,
            });
          } else {
            activeMarkerData.push({
              rows,
              position: group.position,
              slices: getGroupedColours(rows, rowStyles),
              ratio: 0,
              magnitude,
            });
          }
        }
      }

      if (max === min) {
        for (const marker of activeMarkerData) {
          marker.ratio = 1;
        }
      }
      else if (scaleType === "square") {
        const correction = -min;
        const range = (max + correction) ** 0.5;
        for (const marker of activeMarkerData) {
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
          for (const marker of activeMarkerData) {
            marker.ratio = k * Math.log10(marker.magnitude + correction) + c;
          }
        }
      }
      else if (scaleType === "linear") {
        const range = (max - min);
        if (range !== 0) {
          for (const marker of activeMarkerData) {
            marker.ratio = (marker.magnitude - min) / range;
          }
        }
      }
    }

    console.timeEnd(`mapMarkersSelector`)

    return activeMarkerData;
  },
);

export default mapMarkersSelector;
