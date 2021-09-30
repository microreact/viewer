import GeoJsonPolygonLookup from "geojson-geometries-lookup";
import centroid from "@turf/centroid";

import { getGroupedColours } from "../../utils/drawing";
import { createKeyedStateSelector } from "../../utils/state";
import * as Maps from "../../utils/maps";

import rowStylesSelector from "../styles/row-styles";
import mapStateSelector from "./map-state";
import geojsonLayerDataSelector from "./geojson-layer-data";
import activeRowsWithStyleFieldsSelector from "../filters/active-rows-with-style-fields";
import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";

const markersLayerDataSelector = createKeyedStateSelector(
  (state, mapId) => state.maps[mapId].dataType,
  (state, mapId) => state.maps[mapId].latitudeField,
  (state, mapId) => state.maps[mapId].longitudeField,
  (state, mapId) => state.maps[mapId].iso3166Field,
  (state, mapId) => state.maps[mapId].iso3166Subdivisions,

  (state, mapId) => mapStateSelector(state, mapId).groupMarkersByRegion,
  (state, mapId) => mapStateSelector(state, mapId).geodata?.middlePointPropertyName,
  (state, mapId) => geojsonLayerDataSelector(state, mapId),

  (state) => activeRowsWithStyleFieldsSelector(state),
  (state) => dataColumnsByFieldMapSelector(state),
  (state) => rowStylesSelector(state),
  (state, mapId) => mapStateSelector(state, mapId).scaleType,
  (
    dataType,
    latitudeField,
    longitudeField,
    iso3166Field,
    iso3166Subdivisions,

    groupMarkersByRegion,
    middlePointPropertyName,
    geojson,

    [ activeRows ],
    fieldsMap,
    [ rowStyles ],
    scaleType,
  ) => {
    console.time(`mapMarkersSelector`)

    const groupedByPosition = {};

    if (dataType === "geographic-coordinates") {
      const latitudeDataColumn = fieldsMap.get(latitudeField);
      const longitudeDataColumn = fieldsMap.get(longitudeField);

      if (!latitudeDataColumn || !longitudeDataColumn) {
        return undefined;
      }

      // group all rows by position in order to create
      // one marker for all rows at the same position
      for (let index = 0; index < activeRows.length; index++) {
        const row = activeRows[index];
        const latitudeValue = row[latitudeDataColumn.name];
        const longitudeValue = row[longitudeDataColumn.name];
        if (((latitudeValue ?? undefined) !== undefined) && ((longitudeValue ?? undefined) !== undefined)) {
          if (typeof latitudeValue === "number" && typeof longitudeValue === "number") {
            const magnitude = row["--mr-scalar"] ?? 1;
            const groupKey = `${latitudeValue},${longitudeValue}`;
            if (!groupedByPosition[groupKey]) {
              groupedByPosition[groupKey] = {
                position: [ // [lng, lat]: http://visgl.github.io/react-map-gl/docs/api-reference/canvas-overlay
                  longitudeValue,
                  latitudeValue,
                ],
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
    }

    else if (dataType === "iso-3166-codes") {
      console.time(`mapMarkersSelector 1`)

      const valueDataColumn = fieldsMap.get(iso3166Field);
      const ignoreSubdivisions = (iso3166Subdivisions === false);

      if (!valueDataColumn) {
        return undefined;
      }

      const labelFieldName = "--microreact-iso3166-code-name";

      for (let index = 0; index < activeRows.length; index++) {
        const row = activeRows[index];
        let isoCodeValue = row[valueDataColumn.name];
        if (isoCodeValue && isoCodeValue.toUpperCase) {
          if (ignoreSubdivisions && isoCodeValue.length > 2) {
            isoCodeValue = isoCodeValue.substr(0, 2);
          }
          isoCodeValue = isoCodeValue.toUpperCase();

          const codeEntry = Maps.praseCode(isoCodeValue);
          if (codeEntry) {
            const magnitude = row["--mr-scalar"] ?? 1;
            // const groupKey = isoCodeValue;
            const groupKey = codeEntry[0].join(",");
            // const groupKey = codeEntry[0].toString();
            // const groupKey = `${codeEntry[0][0]},${codeEntry[0][1]}`;

            row[labelFieldName] = codeEntry[2];
            if (!groupedByPosition[groupKey]) {
              groupedByPosition[groupKey] = {
                position: codeEntry[0],
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
      console.timeEnd(`mapMarkersSelector 1`)
    }

    else {
      throw new Error(`Invalid map type ${dataType}`);
    }

    let markers = Object.values(groupedByPosition);

    if (markers.length && groupMarkersByRegion) {
      const groupedByRegion = {};

      for (const feature of geojson.features) {
        groupedByRegion[feature.properties["mr-region-id"]] = {
          position: feature.properties[middlePointPropertyName] ?? centroid(feature).geometry.coordinates,
          rows: [],
          magnitude: 0,
        };
      }

      const lookup = new GeoJsonPolygonLookup(geojson);

      for (const marker of markers) {
        const featureCollection = lookup.getContainers({
          type: "Point",
          coordinates: marker.position,
        });

        for (const regionFeature of featureCollection.features) {
          const groupData = groupedByRegion[regionFeature.properties["mr-region-id"]];
          for (const row of marker.rows) {
            groupData.rows.push(row);
          }
          groupData.magnitude += groupData.magnitude;
        }
      }

      markers = Object.values(groupedByRegion);
    }

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

          if (marker.rows.length === 1) {
            marker.style = rowStyles[marker.rows[0][0]];
          }
          else {
            marker.slices = getGroupedColours(marker.rows, rowStyles);
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

    console.timeEnd(`mapMarkersSelector`)

    return markers;
  },
);

export default markersLayerDataSelector;
