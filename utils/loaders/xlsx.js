import { load } from "@loaders.gl/core";

// import { ExcelLoader } from "@loaders.gl/excel";

import { getFetcher } from "../proxy";

import { createBasicDataset } from "../datasets";

function readSpeadsheetFile(arrayBuffer, options) {
  const workbook = options.XLSX.read(
    arrayBuffer, // new Uint8Array(arrayBuffer),
    { type: "array" },
  );

  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const result = options.XLSX.utils.sheet_to_json(worksheet);

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
  return createBasicDataset(data);
}
