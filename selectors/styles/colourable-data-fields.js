import { createSelector } from "reselect";
import { emptyObject } from "../../constants";
import { sortComparator } from "../../utils/arrays";

import dataColumnsSelector from "../datasets/data-columns";

const colourableDataFieldsSelector = createSelector(
  (state) => dataColumnsSelector(state),
  (state) => state.styles.colourSettings || emptyObject,
  (
    dataColumns,
    colourSettings,
  ) => {
    const allDataColumns = dataColumns.sort(sortComparator("name"));

    const colourableDataColumns = [];
    const autocolouredDataColumns = [];

    for (const dataColumn of allDataColumns) {
      dataColumn.isAutocoloured = (!dataColumn.colourPalette && !colourSettings[dataColumn.name]);
      if (dataColumn.isAutocoloured) {
        autocolouredDataColumns.push(dataColumn);
      }
      else {
        colourableDataColumns.push(dataColumn);
      }
    }

    for (const dataColumn of autocolouredDataColumns) {
      colourableDataColumns.push(dataColumn);
    }

    return colourableDataColumns;
  },
);

export default colourableDataFieldsSelector;
