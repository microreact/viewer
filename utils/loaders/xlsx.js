import { load } from "@loaders.gl/core";

// import { ExcelLoader } from "@loaders.gl/excel";

import { getFetcher } from "../proxy";

import { createBasicDataset } from "../datasets";

function readSpeadsheetFile(arrayBuffer, options) {
  const workbook = options.XLSX.read(
    arrayBuffer,
  );

  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const result = options.XLSX.utils.sheet_to_json(
    worksheet,
    { header: 1 },
  );

  return result;
}

const XlsxLoader = {
  name: "XLSX",
  extension: "xlsx",
  extensions: [ "xlsx" ],
  testText: null,
  parse: readSpeadsheetFile,
  parseSync: readSpeadsheetFile,
};

export async function loadSpeadsheetFile(input) {
  const XLSX = await import("xlsx");

  const data = await load(
    input,
    XlsxLoader,
    {
      fetch: getFetcher(),
      XLSX,
    },
  );

  const rows = [];
  const headers = data[0];
  for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
    const rawRow = data[rowIndex];
    const row = {
      "--mr-index": rows.length.toString(),
    };
    for (let colIndex = 0; colIndex < headers.length; colIndex++) {
      const header = headers[colIndex];
      row[header] = rawRow[colIndex];
    }
    rows.push(row);
  }

  return createBasicDataset(
    rows,
    headers,
  );
}
