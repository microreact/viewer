import { createKeyedStateSelector } from "../../utils/state";

const visibleFieldsSelector = createKeyedStateSelector(
  (state, tableId) => state.tables[tableId].columns,
  (
    allColumns,
  ) => {
    const visibleColumns = [];

    for (const column of allColumns) {
      if (!column.hidden) {
        visibleColumns.push(column.field);
      }
    }

    return visibleColumns;
  },
);

export default visibleFieldsSelector;
