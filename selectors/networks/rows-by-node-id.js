import { createKeyedStateSelector } from "../../utils/state";
import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";
import rowsSelector from "../datasets/rows";

const nodeIdColumnSelector = createKeyedStateSelector(
  (state) => dataColumnsByFieldMapSelector(state),
  (state, networkId) => state.networks[networkId].nodeField,
  (
    fieldsMap,
    nodeFieldName,
  ) => {
    return fieldsMap.get(nodeFieldName);
  },
);

const rowsByNodeIdSelector = createKeyedStateSelector(
  (state) => rowsSelector(state),
  (state, networkId) => nodeIdColumnSelector(state, networkId),
  (
    rows,
    nodeIdColumn,
  ) => {
    if (!nodeIdColumn) {
      return undefined;
    }

    const rowsByLabel = new Map();

    for (const row of rows) {
      const label = row[nodeIdColumn.name]?.toString();
      if (label) {
        const array = rowsByLabel.get(label) || [];
        array.push(row);
        rowsByLabel.set(label, array);
      }
    }

    return rowsByLabel;
  },
);

export default rowsByNodeIdSelector;
