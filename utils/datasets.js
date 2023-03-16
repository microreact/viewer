import { leftJoin } from "array-join";
import createTypedDataset from "./data-analyzer";

function generateColourPalette(rows, valueField, colourField) {
  const valueToColour = new Map();

  for (const row of rows) {
    const value = row[valueField.name];
    const colour = row[colourField.name];
    if (value !== null && value !== undefined && value !== "" && colour !== null && colour !== undefined && colour !== "") {
      valueToColour.set(value, colour.toLowerCase());
    }
  }

  // valueToColour.set("", "transparent");

  return Array.from(valueToColour.entries());
}

function generateCustomPalettes(dataset, annotationColumns) {
  const colourPalettes = [];
  const shapePalettes = [];
  for (const styleField of annotationColumns) {
    const annotatedColumn = (
      dataset.columns.find((x) => x.name === styleField.annotatedFieldName)
      ||
      dataset.columns.find((x) => x.normalised === styleField.annotatedFieldName.toLowerCase())
    );
    if (annotatedColumn) {
      const paletteName = `palette-from-${styleField.normalised}`;
      const paletteEntries = generateColourPalette(
        dataset.rows,
        annotatedColumn,
        styleField
      );
      const palette = {
        entries: paletteEntries,
        label: styleField.name,
        name: paletteName,
        type: "custom",
      };
      if (styleField.annotationType === "colour") {
        colourPalettes.push(palette);
        annotatedColumn.colourPalette = paletteName;
      }
      else if (styleField.annotationType === "shape") {
        shapePalettes.push(palette);
        annotatedColumn.shapePalette = paletteName;
      }
    }
  }

  return {
    colourPalettes,
    shapePalettes,
  };
}

export function detectAnnotationFields(datasetColumns) {
  const annotationFields = [];
  const dataFields = [];
  for (const field of datasetColumns) {
    const annotaionMatch = field.name.match(/(.+)__(color|colour|shape|pattern|url)$/i);

    if (annotaionMatch !== null) {
      field.annotatedFieldName = annotaionMatch[1];
      field.annotationType = annotaionMatch[2].toLowerCase();

      if (field.annotationType === "color") {
        field.annotationType = "colour";
      }

      if (field.annotationType === "url") {
        const annotatedColumn = datasetColumns.find((x) => x.name === field.annotatedFieldName);
        if (annotatedColumn) {
          annotatedColumn.urlField = field.name;
        }
      }

      annotationFields.push(field);
    }
    else if (field.name !== "--mr-index") {
      dataFields.push(field);
    }
  }

  return {
    annotationFields,
    dataFields,
  };
}

export function createBasicDataset(rows, headers) {
  const headerRow = (headers && headers.length) ? headers : Object.keys(rows[0]);
  return createTypedDataset(rows, headerRow);
}

export function createFullDataset(baseDataset) {
  const { annotationFields, dataFields } = detectAnnotationFields(baseDataset.columns);
  const customPalettes = generateCustomPalettes(baseDataset, annotationFields);

  return {
    columns: dataFields,
    // rawColumns: baseDataset.columns,
    rows: [ ...baseDataset.rows ],
    colourPalettes: customPalettes.colourPalettes,
    shapePalettes: customPalettes.shapePalettes,
  };
}

export function mergeBasicDatasets(masterDataset, linkedDataset, masterFieldName, linkFieldName) {
  const leftDataField = masterDataset.columns.find((x) => x.name === masterFieldName);
  const rightDataField = linkedDataset.columns.find((x) => x.name === linkFieldName);

  const mergedRows = leftJoin(
    masterDataset.rows,
    linkedDataset.rows,
    {
      key1: leftDataField.name,
      key2: rightDataField.name,
    },
  );

  const mergedFields = [
    ...masterDataset.columns,
    ...linkedDataset.columns,
  ];

  return {
    columns: mergedFields,
    rows: mergedRows,
  };
}
