import { createSelector } from "reselect";

import fullDatasetSelector from "./full-dataset";

const groupSeparator = "::";

const dataColumnsSelector = createSelector(
  (state) => fullDatasetSelector(state),
  (
    dataset,
  ) => {
    const columns = [];

    if (dataset?.columns) {
      for (const item of dataset.columns) {
        const rawDataType = (
          (item.type === "date" || item.type === "timestamp") ? "date" :
            (item.type === "integer" || item.type === "real" || item.type === "percent" || item.type === "currency") ? "number" :
              "text"
        );
        const dataType = item.userDataType || rawDataType;

        const normalisedName = item.name.trim().toLowerCase();

        let label = item.name;
        let group = null;

        if (item.label) {
          label = item.label;
        }
        else if (item.name.toLowerCase().endsWith("__autocolour")) {
          label = item.name.substring(0, item.name.length - 12);
        }
        else if (item.name.toLowerCase().endsWith("__autocolor")) {
          label = item.name.substring(0, item.name.length - 11);
        }

        if (label.includes(groupSeparator)) {
          const strings = label.split(groupSeparator);
          group = strings[0];
          label = strings[1];
        }

        columns.push({
          label,
          group,
          name: item.name,
          format: item.format,
          normalised: normalisedName,
          dataType,
          rawDataType,
          isNumeric: (dataType === "number"),
          colourPalette: item.colourPalette,
          shapePalette: item.shapePalette,
          urlField: item.urlField,
        });
      }
    }

    return columns;
  },
);

export default dataColumnsSelector;
