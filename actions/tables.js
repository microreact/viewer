/* eslint-disable no-use-before-define */
import Papaparse from "papaparse";

import fullDatasetSelector from "../selectors/datasets/full-dataset";
import tableStateSelector from "../selectors/tables/table-state";
import paneNameSelector from "../selectors/panes/pane-name";
import { getPresentState } from "../utils/state";

import { measureWidth } from "../utils/text";
import { normaliseFilename } from "../utils/files";
import { downloadDataUrl } from "../utils/downloads";
import tableDataSelector from "../selectors/tables/table-data";

export function addTable(paneId, title, fileId, columns) {
  return {
    type: "MICROREACT VIEWER/ADD TABLE",
    payload: {
      paneId,
      title: title || "Table",
      columns,
      file: fileId,
    },
  };
}

export function downloadAsCsv(tableId) {
  return (dispatch, getState) => {
    const state = getPresentState(getState());
    const [rows] = tableDataSelector(state, tableId);
    const name = paneNameSelector(state, tableId);
    const tableColumns = (
      state.tables[tableId].columns
        .filter((x) => !x.hidden)
        .map((x) => x.field)
    );
    const csv = Papaparse.unparse(
      rows,
      {
        quotes: true,
        columns: tableColumns,
      }
    );
    downloadDataUrl(
      csv,
      `${normaliseFilename(name)}.csv`,
      "text/csv",
    );
  };
}

export function expandColumn(tableId, field) {
  return (dispatch, getState) => {
    const state = getPresentState(getState());
    const { columns, rows } = fullDatasetSelector(state);
    const tableColumn = state.tables[tableId].columns.find((x) => x.field === field);
    const dataColumn = columns.find((x) => x.name === field);
    let longestLabel = "";
    for (const row of rows) {
      if (row[dataColumn.name] && row[dataColumn.name].length > longestLabel.length) {
        longestLabel = row[dataColumn.name];
      }
    }
    const width = Math.max(
      measureWidth(tableColumn.label || dataColumn.name) + 36, /* (twice padding of 8px) plus 4px (for sort indicator) plus 16px (for filter menu button)  */
      measureWidth(longestLabel) + 16 /* (twice padding of 8px) */
    );
    dispatch(
      resizeColumn(
        tableId,
        field,
        width,
      )
    );
  };
}

export function hideColumn(tableId, field) {
  return {
    delay: true,
    label: `Table: Hide ${field} column`,
    payload: field,
    tableId,
    type: "MICROREACT VIEWER/HIDE COLUMN",
  };
}

export function moveColumn(tableId, field, newIndex) {
  return {
    delay: true,
    label: "Table: Move column",
    payload: {
      field,
      newIndex,
    },
    tableId,
    type: "MICROREACT VIEWER/MOVE COLUMN",
  };
}

export function removeTable(paneId) {
  return (dispatch, getState) => {
    const state = getPresentState(getState());
    const tableState = tableStateSelector(state, paneId);
    dispatch({
      delay: true,
      group: `${paneId}/remove`,
      label: "Table: Remove Table",
      payload: {
        paneId,
        fileId: tableState.file,
      },
      type: "MICROREACT VIEWER/REMOVE TABLE",
    });
  };
}

export function resizeColumn(tableId, field, width) {
  return {
    delay: true,
    label: `Table: Resize ${field} column`,
    payload: {
      field,
      width,
    },
    tableId,
    type: "MICROREACT VIEWER/RESIZE COLUMN",
  };
}

export function setVisibleColumns(tableId, fields) {
  return {
    delay: true,
    label: "Table: Change visible columns",
    payload: fields,
    tableId,
    type: "MICROREACT VIEWER/SET VISIBLE COLUMNS",
  };
}

export function sortColumn(tableId, field, direction) {
  return {
    delay: true,
    label: `Table: Sort by ${field}`,
    payload: {
      field,
      direction,
    },
    tableId,
    type: "MICROREACT VIEWER/SORT COLUMN",
  };
}

export function update(tableId, key, value) {
  return {
    delay: true,
    group: `${tableId}/${key}`,
    label:
      (key === "displayMode") ? `Table: Set display mode to ${value}` :
        (key === "hideUnselected") ? "Table: Toogle show/hide unselected entries" :
          undefined,
    payload: { [key]: value },
    tableId,
    type: "MICROREACT VIEWER/UPDATE TABLE",
  };
}
