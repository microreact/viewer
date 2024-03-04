/* eslint-disable no-use-before-define */
import Papaparse from "papaparse";

import fullDatasetSelector from "../selectors/datasets/full-dataset";
import tableStateSelector from "../selectors/tables/table-state";
import paneNameSelector from "../selectors/panes/pane-name";
import { getPresentState } from "../utils/state";

import { measureWidth, toText } from "../utils/text";
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
      const label = toText(
        dataColumn.type,
        row[dataColumn.name],
        false /* convertBlanks */,
      );
      if (dataColumn.name in row && label.length > longestLabel.length) {
        longestLabel = label;
      }
    }
    const width = Math.max(
      measureWidth((tableColumn.label || dataColumn.name || "").toString()) + 48, /* 32px (twice padding of 16px) plus 16px (for filter menu button)  */
      measureWidth((longestLabel ?? "").toString()) + 32 /* (twice padding of 16px) */
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

export function moveColumn(tableId, oldIndex, newIndex) {
  return {
    delay: true,
    label: "Table: Move column",
    payload: {
      oldIndex,
      newIndex,
    },
    tableId,
    type: "MICROREACT VIEWER/MOVE COLUMN",
  };
}

export function reorderColumns(tableId, columnsOrder) {
  return {
    delay: true,
    group: "move columns",
    label: "Table: Move columns",
    payload: columnsOrder,
    tableId,
    type: "MICROREACT VIEWER/REORDER COLUMN",
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

export function resetColumns(tableId) {
  return (dispatch, getState) => {
    const state = getPresentState(getState());
    const { columns } = fullDatasetSelector(state);
    const fields = [];
    for (const dataColumn of columns) {
      fields.push(dataColumn.name);
    }
    dispatch(
      reorderColumns(tableId, fields)
    );
  };
}

export function resizeColumn(tableId, field, width) {
  return {
    delay: true,
    label: `Table: Resize ${field} column`,
    group: "resize columns",
    payload: {
      field,
      width,
    },
    tableId,
    type: "MICROREACT VIEWER/RESIZE COLUMN",
  };
}

export function resizeColumns(tableId, sizes) {
  return (dispatch, getState) => {
    for (const [ field, width ] of Object.entries(sizes)) {
      dispatch(
        resizeColumn(tableId, field, width)
      );
    }
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
