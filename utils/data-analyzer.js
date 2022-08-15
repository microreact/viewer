/* eslint "no-use-before-define": 0 */

import { console as globalConsole } from "global/window";
import { Analyzer, DATA_TYPES as AnalyzerDataTypes } from "type-analyzer";

import { isValidDateInstance, toDateInstance, isoDateToDateInstance, timestampToDateInstance } from "./datetime";

const ALL_FIELD_TYPES = {
  boolean: "boolean",
  date: "date",
  geojson: "geojson",
  integer: "integer",
  real: "real",
  string: "string",
  timestamp: "timestamp",
  point: "point",
};

const ACCEPTED_ANALYZER_TYPES = [
  AnalyzerDataTypes.DATE,
  // AnalyzerDataTypes.TIME,
  AnalyzerDataTypes.DATETIME,
  AnalyzerDataTypes.NUMBER,
  AnalyzerDataTypes.INT,
  AnalyzerDataTypes.FLOAT,
  // AnalyzerDataTypes.BOOLEAN,
  AnalyzerDataTypes.STRING,
  AnalyzerDataTypes.GEOMETRY,
  AnalyzerDataTypes.GEOMETRY_FROM_STRING,
  AnalyzerDataTypes.PAIR_GEOMETRY_FROM_STRING,
  AnalyzerDataTypes.ZIPCODE,
  AnalyzerDataTypes.ARRAY,
  AnalyzerDataTypes.OBJECT,
];

const PARSE_FIELD_VALUE_FROM_STRING = {
  [ALL_FIELD_TYPES.boolean]: {
    valid: (d) => typeof d === "boolean",
    parse: (d) => d === "true" || d === "True" || d === "1" || /yes/i.test(d),
  },
  [ALL_FIELD_TYPES.integer]: {
    valid: (d) => parseInt(d, 10) === d,
    parse: (d) => parseInt(d, 10),
  },
  [ALL_FIELD_TYPES.timestamp]: {
    valid: (d, field) => {
      return isValidDateInstance(d);
      // return (
      //   [ "x", "X" ].includes(field.format) ?
      //     typeof d === "number" :
      //     typeof d === "string"
      // );
    },
    parse: (d, field) => {
      return ([ "x", "X" ].includes(field.format) ? timestampToDateInstance(d) : isoDateToDateInstance(d));
    },
  },
  [ALL_FIELD_TYPES.date]: {
    valid: (d, field) => (isValidDateInstance(d)),
    parse: (d, field) => (toDateInstance(d, field.format)),
  },
  [ALL_FIELD_TYPES.real]: {
    valid: (d) => parseFloat(d) === d,
    parse: (d) => {
      const number = parseFloat(d);
      return Number.isNaN(number) ? null : number;
    },
  },
};

const IGNORE_DATA_TYPES = Object.keys(AnalyzerDataTypes).filter(
  (type) => !ACCEPTED_ANALYZER_TYPES.includes(type)
);

function getSampleForTypeAnalyze(allData, headerNames) {
  let sampleCount = 0;
  if (allData.length <= 1000) {
    sampleCount = allData.length;
  }
  else {
    sampleCount = Math.ceil(allData.length / 50);
    if (sampleCount > 5000) {
      sampleCount = 5000;
    }
  }
  // const fieldOrder = fields.map(f => f.name);
  const sample = [];
  for (let index = 0; index < sampleCount; index++) {
    sample.push({});
  }

  // collect sample data for each field
  headerNames.forEach((field) => {
    // data counter
    let i = 0;
    // sample counter
    let j = 0;

    while (j < sampleCount) {
      if (i >= allData.length) {
        // if depleted data pool
        sample[j][field] = null;
        j++;
      } else if (allData[i][field] !== null && allData[i][field] !== undefined) {
        sample[j][field] = allData[i][field];
        j++;
        i++;
      } else {
        i++;
      }
    }
  });

  return sample;
}

function getFieldsFromData(data, fieldOrder) {
  // add a check for epoch timestamp
  const metadata = Analyzer.computeColMeta(
    data,
    [
      // { regex: /.*geojson|all_points/g, dataType: "GEOMETRY" },
    ],
    { ignoredDataTypes: IGNORE_DATA_TYPES }
  );

  const { fieldByIndex } = renameDuplicateFields(fieldOrder);

  const result = fieldOrder.reduce(
    (orderedArray, field, index) => {
      const name = fieldByIndex[index];

      const fieldMeta = metadata.find((m) => m.key === field);
      const { type, format } = fieldMeta || {};

      const fieldType = analyzerTypeToFieldType(type);

      orderedArray[index] = {
        name,
        format,
        normalised: name.toLowerCase(),
        type: fieldType,
      };

      if (name === "--mr-index") {
        orderedArray[index].label = "Index (Microreact)";
      }
      else if (name === "--mr-scalar") {
        orderedArray[index].label = "Number of entries (Microreact)";
      }

      return orderedArray;
    },
    [],
  );

  return result;
}

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

function analyzerTypeToFieldType(aType) {
  const {
    DATE,
    TIME,
    DATETIME,
    NUMBER,
    INT,
    FLOAT,
    BOOLEAN,
    STRING,
    GEOMETRY,
    GEOMETRY_FROM_STRING,
    PAIR_GEOMETRY_FROM_STRING,
    ZIPCODE,
    ARRAY,
    OBJECT,
  } = AnalyzerDataTypes;

  // TODO: un recognized types
  // CURRENCY PERCENT NONE
  switch (aType) {
    case DATE:
      return ALL_FIELD_TYPES.date;
    case TIME:
    case DATETIME:
      // return ALL_FIELD_TYPES.date;
      return ALL_FIELD_TYPES.timestamp;
    case NUMBER:
    case FLOAT:
      return ALL_FIELD_TYPES.real;
    case INT:
      return ALL_FIELD_TYPES.integer;
    case BOOLEAN:
      return ALL_FIELD_TYPES.boolean;
    case GEOMETRY:
    case GEOMETRY_FROM_STRING:
    case PAIR_GEOMETRY_FROM_STRING:
    case ARRAY:
    case OBJECT:
      // TODO: create a new data type for objects and arrays
      return ALL_FIELD_TYPES.geojson;
    case STRING:
    case ZIPCODE:
      return ALL_FIELD_TYPES.string;
    default:
      globalConsole.warn(`Unsupported analyzer type: ${aType}`);
      return ALL_FIELD_TYPES.string;
  }
}

function parseCsvRowsByFieldType(rows, geoFieldIdx, field) {
  const parser = PARSE_FIELD_VALUE_FROM_STRING[field.type];
  if (parser) {
    // check first not null value of it's already parsed
    const first = rows.find((r) => (r[field.name] !== undefined && r[field.name] !== null));
    if (!first || parser.valid(first[field.name], field)) {
      return;
    }
    rows.forEach((row) => {
      if (Array.isArray(row[field.name]) && row[field.name].length === 0) {
        row[field.name] = null;
      }
      // parse string value based on field type
      else if (row[field.name] !== null) {
        row[field.name] = parser.parse(row[field.name], field);
        // if (geoFieldIdx > -1 && row[geoFieldIdx] && row[geoFieldIdx].properties) {
        //   row[geoFieldIdx].properties[field.name] = row[field.name];
        // }
      }
    });
  }
}

function guessDataColumnsFromRows(rows, headerRow) {
  const sample = getSampleForTypeAnalyze(rows, headerRow);

  const columns = getFieldsFromData(sample, headerRow);

  return columns;
}

function parseRowsByDataColumns(rows, fields) {
  // Edit rows in place
  const geojsonFieldIdx = fields.findIndex((f) => f.name === "_geojson");

  fields.forEach(parseCsvRowsByFieldType.bind(null, rows, geojsonFieldIdx));

  return rows;
}

export default function createTypedDataset(rawRows, headers) {
  const columns = guessDataColumnsFromRows(rawRows, headers);

  const rows = parseRowsByDataColumns(rawRows, columns);

  return {
    columns,
    rows,
  };
}
