/* eslint-disable no-plusplus */
import { loadInBatches } from "@loaders.gl/core";
import { CSVLoader } from "@loaders.gl/csv";

import { createBasicDataset } from "../datasets";
import { getFetcher } from "../proxy";

// if any of these value occurs in csv, parse it to null;
const CsvNullValues = [ "", "null", "NULL", "Null", "NaN", "\n" ];

function cleanUpFalsyCsvValue(value) {
  // analyzer will set any fields to 'string' if there are empty values
  // which will be parsed as '' by d3.csv
  // here we parse empty data as null
  if (!value || CsvNullValues.includes(value)) {
    return null;
  }
  else {
    return value.trim ? value.trim() : value;
  }
}

export async function loadCsvFile(fileBlobOrUrl, settings, onProgress) {
  const loaderOptions = {
    fetch: getFetcher(),
    csv: {
      dynamicTyping: false,
      // header: header ?? "auto",
      header: true, // If true, the first row of parsed data will be interpreted as field names
      rowFormat: "object",
      delimitersToGuess: ["\t"],
      skipEmptyLines: true,
      // transform: cleanUpFalsyCsvValue,
      transformHeader(x) {
        return x.trim ? x.trim() : x;
      },
    },
  };

  let rows;

  if (settings?.aggregate) {
    const groups = {};
    let index = 1;
    for await (const batch of await loadInBatches(fileBlobOrUrl, CSVLoader, loaderOptions)) {
      for (const row of batch.data) {
        for (const key of Object.keys(row)) {
          row[key] = cleanUpFalsyCsvValue(row[key]);
        }
        const keys = [];
        for (const field of settings.aggregate) {
          keys.push(row[field]);
        }
        const key = keys.join();
        if (key in groups) {
          groups[key]["--mr-scalar"] += 1;
        }
        else {
          groups[key] = {
            "--mr-scalar": 1,
            "--mr-index": (index++).toString(),
          };
          for (const field of settings.aggregate) {
            groups[key][field] = row[field];
          }
        }
      }
    }
    rows = Object.values(groups);
  }
  else {
    let index = 1;
    rows = [];
    for await (const batch of await loadInBatches(fileBlobOrUrl, CSVLoader, loaderOptions)) {
      onProgress && onProgress(batch.bytesUsed);
      for (const row of batch.data) {
        row["--mr-index"] = (index).toString();
        for (const key of Object.keys(row)) {
          row[key] = cleanUpFalsyCsvValue(row[key]);
        }
        rows.push(row);
        index += 1;
      }
    }
    // rows = await load(
    //   fileBlobOrUrl,
    //   CSVLoader,
    //   loaderOptions,
    // );
    // for (let index = 0; index < rows.length; index++) {
    //   rows[index]["--mr-index"] = (index + 1).toString();
    // }
  }

  return createBasicDataset(rows);
}
