import { createSelector } from "reselect";

import fullDatasetSelector from "./full-dataset";

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

        columns.push({
          label: (
            item.label
            ??
            (
              item.name.toLowerCase().endsWith("__autocolour") ? item.name.substring(0, item.name.length - 12) :
                item.name.toLowerCase().endsWith("__autocolor") ? item.name.substring(0, item.name.length - 11) :
                  item.name
            )
          ),
          name: item.name,
          format: item.format,
          normalised: item.name.toLowerCase(),
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
