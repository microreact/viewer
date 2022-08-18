import { createSelector } from "reselect";
import dataColumnsSelector from "./data-columns";
// import fullDatasetSelector from "./full-dataset";

const dataColumnsByFieldMapSelector = createSelector(
  dataColumnsSelector,
  // fullDatasetSelector,
  (
    columns = [],
    // fullDataset,
  ) => {
    const map = new Map();

    // if (fullDataset?.rawColumns) {
    //   for (const item of fullDataset.rawColumns) {
    //     map.set(item.name, item);
    //   }
    // }

    for (const item of columns) {
      map.set(item.name, item);
      map.set(item.normalised, item);
    }

    return map;
  },
);

export default dataColumnsByFieldMapSelector;
