import { createKeyedStateSelector } from "../../utils/state";
import * as Maps from "../../utils/maps";

import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";
import rowsSelector from "../datasets/rows";

const mapDataSelector = createKeyedStateSelector(
  (state) => rowsSelector(state),
  (state) => dataColumnsByFieldMapSelector(state),
  (state, mapId) => state.maps[mapId].dataType,
  (state, mapId) => state.maps[mapId].latitudeField,
  (state, mapId) => state.maps[mapId].longitudeField,
  (state, mapId) => state.maps[mapId].iso3166Field,
  (state, mapId) => state.maps[mapId].iso3166Subdivisions,
  (
    rows,
    fieldsMap,
    dataType,
    latitudeField,
    longitudeField,
    iso3166Field,
    iso3166Subdivisions,
  ) => {
    const groupedData = {};

    console.time(`mapDataSelector`)

    if (dataType === "geographic-coordinates") {
      const latitudeDataColumn = fieldsMap.get(latitudeField);
      const longitudeDataColumn = fieldsMap.get(longitudeField);

      if (!latitudeDataColumn || !longitudeDataColumn) {
        return undefined;
      }

      // group all rows by position in order to create
      // one marker for all rows at the same position
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        const latitudeValue = row[latitudeDataColumn.name];
        const longitudeValue = row[longitudeDataColumn.name];
        if (((latitudeValue ?? undefined) !== undefined) && ((longitudeValue ?? undefined) !== undefined)) {
          if (typeof latitudeValue === "number" && typeof longitudeValue === "number") {
            const groupKey = `${latitudeValue},${longitudeValue}`;
            if (!groupedData[groupKey]) {
              groupedData[groupKey] = {
                position: [ // [lng, lat]: http://visgl.github.io/react-map-gl/docs/api-reference/canvas-overlay
                  longitudeValue,
                  latitudeValue,
                ],
                rows: [ row ],
              };
            }
            else {
              groupedData[groupKey].rows.push(row);
            }
          }
        }
      }
    }

    else if (dataType === "iso-3166-codes") {
      const valueDataColumn = fieldsMap.get(iso3166Field);
      const ignoreSubdivisions = (iso3166Subdivisions === false);

      if (!valueDataColumn) {
        return undefined;
      }

      const labelFieldName = "--microreact-iso3166-code-name";

      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        let groupKey = row[valueDataColumn.name];
        if (groupKey && groupKey.toUpperCase) {
          if (ignoreSubdivisions && groupKey.length > 2) {
            groupKey = groupKey.substr(0, 2);
          }
          groupKey = groupKey.toUpperCase();

          const codeEntry = Maps.praseCode(groupKey);
          if (codeEntry) {
            row[labelFieldName] = codeEntry[2];
            if (!groupedData[groupKey]) {
              groupedData[groupKey] = {
                position: codeEntry[0],
                rows: [ row ],
              };
            }
            else {
              groupedData[groupKey].rows.push(row);
            }
          }
        }
      }
    }

    else {
      throw new Error(`Invalid map type ${dataType}`);
    }

    const markers = Object.values(groupedData);

    console.timeEnd(`mapDataSelector`)

    return markers;
  },
);

export default mapDataSelector;
