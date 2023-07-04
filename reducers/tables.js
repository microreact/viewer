/* eslint-disable prefer-object-spread */

import { swap } from "../utils/arrays";
import { mapQueryToProps } from "../utils/query";
import {
  newId,
  updateKeyedState as updateTable,
  updateAll as updateAllTables,
} from "../utils/state";

const initialState = {
  displayMode: "cosy",
  hideUnselected: false,
};

const queryPropMap = {
};

function updateTableColumn(state, tableId, field, updater) {
  const columns = state[tableId].columns.slice();
  const columnIndex = columns.findIndex((x) => x.field === field);
  if (columnIndex === -1) {
    throw new Error(`Cannot find column "${field}"`);
  }
  columns[columnIndex] = Object.assign(
    {},
    columns[columnIndex],
    updater
  );
  return updateTable(
    state,
    tableId,
    { columns }
  );
}

const reducer = (state = {}, action) => {
  switch (action.type) {

    case "MICROREACT VIEWER/ADD TABLE": {
      const tableId = action.payload.paneId || newId(state, "table");
      return {
        ...state,
        [tableId]: {
          ...initialState,
          title: action.payload.title,
          ...action.payload,
        },
      };
    }

    case "MICROREACT VIEWER/LOAD": {
      const tables = {};
      for (const tableId of Object.keys(action.payload.tables)) {
        tables[tableId] = {
          ...initialState,
          ...action.payload.tables[tableId],
          ...mapQueryToProps(queryPropMap, action.payload.query),
        };
      }
      return tables;
    }

    case "MICROREACT VIEWER/QUERY": {
      const queryState = mapQueryToProps(queryPropMap, action.payload);
      if (Object.keys(queryState)) {
        return updateAllTables(
          state,
          queryState,
        );
      }
      else {
        return state;
      }
    }

    case "MICROREACT VIEWER/HIDE COLUMN": {
      return updateTableColumn(
        state,
        action.tableId,
        action.payload,
        { hidden: true },
      );
    }

    case "MICROREACT VIEWER/MOVE COLUMN": {
      action.label = `Table: Move ${action.payload.field} column`;
      const oldIndex = state[action.tableId].columns.findIndex((column) => column.field === action.payload.field)
      const updater = {
        columns: swap(
          state[action.tableId].columns,
          oldIndex,
          action.payload.newIndex,
        ),
      };
      return updateTable(
        state,
        action.tableId,
        updater,
      );
    }

    case "MICROREACT VIEWER/RESIZE COLUMN": {
      return updateTableColumn(
        state,
        action.tableId,
        action.payload.field,
        { width: action.payload.width },
      );
    }

    case "MICROREACT VIEWER/SET VISIBLE COLUMNS": {
      const columns = [...state[action.tableId].columns];
      for (let index = 0; index < columns.length; index++) {
        const tableColumn = columns[index];
        columns[index] = {
          ...tableColumn,
          hidden: !action.payload.includes(tableColumn.field),
        };
      }
      for (const field of action.payload) {
        if (!columns.find((x) => x.field === field)) {
          columns.push({ field });
        }
      }
      return updateTable(
        state,
        action.tableId,
        { columns },
      );
    }

    case "MICROREACT VIEWER/SORT COLUMN": {
      return updateTableColumn(
        state,
        action.tableId,
        action.payload.field,
        { sort: action.payload.direction },
      );
    }

    case "MICROREACT VIEWER/UPDATE TABLE": {
      return updateTable(
        state,
        action.tableId,
        action.payload,
      );
    }

    default:
      return state;
  }
};

export default reducer;
