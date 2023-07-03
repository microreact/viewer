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

function renameDuplicateFields(fieldOrder) {
  return fieldOrder.reduce(
    (accu, field, i) => {
      const { allNames } = accu;
      let fieldName = field;

      // add a counter to duplicated names
      if (allNames.includes(field)) {
        let counter = 0;
        while (allNames.includes(`${field}-${counter}`)) {
          counter++;
        }
        fieldName = `${field}-${counter}`;
      }

      accu.fieldByIndex[i] = fieldName;
      accu.allNames.push(fieldName);

      return accu;
    },
    {
      allNames: [],
      fieldByIndex: {},
    }
  );
}

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
  const { allNames: headers } = renameDuplicateFields(data[0].filter((x) => !!x));
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
    [
      ...headers,
      "--mr-index",
    ],
  );
}
