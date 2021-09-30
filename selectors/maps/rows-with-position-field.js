import { createKeyedStateSelector } from "../../utils/state";
import { praseCode } from "../../utils/maps";

import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";
import mapStateSelector from "./map-state";
import rowsSelector from "../datasets/rows";

const rowsWithPositionFieldSelector = createKeyedStateSelector(
  (state) => rowsSelector(state),
  (state) => dataColumnsByFieldMapSelector(state),

  (state, mapId) => mapStateSelector(state, mapId).dataType,
  (state, mapId) => mapStateSelector(state, mapId).latitudeField,
  (state, mapId) => mapStateSelector(state, mapId).longitudeField,
  (state, mapId) => mapStateSelector(state, mapId).iso3166Field,
  (state, mapId) => mapStateSelector(state, mapId).iso3166Subdivisions,

  (state, mapId) => `--mr-${mapId}`,
  (
    rows,
    fieldsMap,

    dataType,
    latitudeField,
    longitudeField,
    iso3166Field,
    iso3166Subdivisions,

    positionFieldName,
  ) => {
    if (dataType === "geographic-coordinates") {
      const latitudeDataColumn = fieldsMap.get(latitudeField);
      const longitudeDataColumn = fieldsMap.get(longitudeField);

      if (!latitudeDataColumn || !longitudeDataColumn) {
        return undefined;
      }

      // group all rows by position in order to create
      // one marker for all rows at the same position
      for (const row of rows) {
        const latitudeValue = (
          (typeof row[latitudeDataColumn.name] === "number")
            ?
            (row[latitudeDataColumn.name] ?? null)
            :
            parseFloat(row[latitudeDataColumn.name])
        );
        const longitudeValue = (
          (typeof row[longitudeDataColumn.name] === "number")
            ?
            (row[longitudeDataColumn.name] ?? null)
            :
            parseFloat(row[longitudeDataColumn.name])
        );
        if (latitudeValue !== null && longitudeValue !== null && !Number.isNaN(latitudeValue) && !Number.isNaN(longitudeValue)) {
          row[positionFieldName] = [ // [lng, lat]: http://visgl.github.io/react-map-gl/docs/api-reference/canvas-overlay
            longitudeValue,
            latitudeValue,
          ];
        }
      }
    }

    else if (dataType === "iso-3166-codes") {
      const valueDataColumn = fieldsMap.get(iso3166Field);
      const ignoreSubdivisions = (iso3166Subdivisions === false);

      if (!valueDataColumn) {
        return undefined;
      }

      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        let codeValue = row[valueDataColumn.name];
        if (codeValue && codeValue.toUpperCase) {
          if (ignoreSubdivisions && codeValue.length > 2) {
            codeValue = codeValue.substr(0, 2);
          }
          codeValue = codeValue.toUpperCase();

          const codeEntry = praseCode(codeValue);
          if (codeEntry) {
            row["--microreact-iso3166-code-name"] = codeEntry[2];
            row[positionFieldName] = codeEntry[0];
          }
        }
      }
    }

    else {
      throw new Error(`Invalid map type ${dataType}`);
    }

    return positionFieldName;
  },
);

export default rowsWithPositionFieldSelector;
