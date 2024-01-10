/* eslint-disable no-restricted-globals */

import { emptyObject } from "../../constants";
import { createKeyedStateSelector } from "../../utils/state";

import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";
import rowsSelector from "../datasets/rows";

const rowsWithDateFieldSelector = createKeyedStateSelector(
  (state) => rowsSelector(state),
  (state) => dataColumnsByFieldMapSelector(state),
  (state, timelineId) => state.timelines[timelineId].dataType,
  (state, timelineId) => state.timelines[timelineId].yearField,
  (state, timelineId) => state.timelines[timelineId].monthField,
  (state, timelineId) => state.timelines[timelineId].dayField,
  (state, timelineId) => state.timelines[timelineId].valueField,
  (state, timelineId) => `--mr-${timelineId}`,
  (
    rows,
    fieldsMap,
    timelineType,
    yearFieldName,
    monthFieldName,
    dayFieldName,
    valueFieldName,
    timelineFieldName,
  ) => {
    let minDate = Number.MAX_SAFE_INTEGER;
    let maxDate = Number.MIN_SAFE_INTEGER;

    if (timelineType === "year-month-day") {
      const yearField = fieldsMap.get(yearFieldName);
      if (yearField) {
        const monthField = fieldsMap.get(monthFieldName);
        const dayField = fieldsMap.get(dayFieldName);
        const yearFieldIndex = yearField.name;
        for (const row of rows) {
          const yearValue = parseInt(row[yearFieldIndex], 10);
          if (Number.isInteger(yearValue)) {
            let month = 1;
            let day = 1;
            if (monthField) {
              const monthValue = parseInt(row[monthField.name], 10);
              if (Number.isInteger(monthValue)) {
                month = monthValue;
              }
            }
            if (dayField) {
              const dayValue = parseInt(row[dayField.name], 10);
              if (Number.isInteger(dayValue)) {
                day = dayValue;
              }
            }
            if (dayField && Number.isFinite(row[dayField.name])) {
              day = parseInt(row[dayField.name], 10);
            }
            const dateInstance = new Date(
              yearValue,
              month - 1,
              day,
            );

            row[timelineFieldName] = dateInstance;
            const timestamp = dateInstance.valueOf();

            if (timestamp < minDate) {
              minDate = timestamp;
            }
            if (timestamp > maxDate) {
              maxDate = timestamp;
            }
          }
        }

        return {
          extent: [ minDate, maxDate ],
          dateFieldName: timelineFieldName,
        };
      }
    }

    else if (timelineType === "formatted-value") {
      const valueDataColumn = fieldsMap.get(valueFieldName);
      if (valueDataColumn) {
        for (const row of rows) {
          if (row[valueDataColumn.name] instanceof Date) {
            // const dateInstance = (
            //   (timelineFields.format && timelineFields.format !== valueDataColumn.format)
            //     ?
            //     Datetime.toDate(row[valueDataColumn.name], timelineFields.format)
            //     :
            //     row[valueDataColumn.name]
            // );

            const timestamp = row[valueDataColumn.name].valueOf();

            if (timestamp < minDate) {
              minDate = timestamp;
            }
            if (timestamp > maxDate) {
              maxDate = timestamp;
            }

            // row[timelineId] = valueDataColumn.name;
          }
        }

        return {
          extent: [ minDate, maxDate ],
          dateFieldName: valueDataColumn.name,
        };
      }
    }

    else {
      throw new Error(`Invalid timeline type ${timelineType}`);
    }

    return emptyObject;
  },
);

export default rowsWithDateFieldSelector;
