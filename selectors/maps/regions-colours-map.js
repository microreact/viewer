// import randomcolor from "randomcolor";
import { scaleLinear } from "d3-scale";
import {
  extent,
  max,
  mean,
  median,
  min,
  sum,
} from "d3-array";

import {
  firstElement,
  lastElement,
  mode,
  uniqueElementsCount,
} from "../../utils/arrays";
import { createKeyedStateSelector } from "../../utils/state";

import rowsByRegionSelector from "./rows-by-region";
import dataColumnsByFieldMapSelector from "../datasets/data-columns-by-field-map";
import colourPalettesSelector from "../styles/colour-palettes";

const computeColourMethods = {
  max,
  mean,
  median,
  min,
  mode,
  sum,
  first: firstElement,
  last: lastElement,
  unique: uniqueElementsCount,
};

const regionValueFunctionSelector = createKeyedStateSelector(
  (state, mapId) => dataColumnsByFieldMapSelector(state).get(state.maps[mapId].regionsColourField),
  (state, mapId) => state.maps[mapId].regionsColourMethod,
  (
    regionsColourDataField,
    regionsColourMethod,
  ) => {
    if (regionsColourDataField) {
      const colourMethod = regionsColourMethod || (regionsColourDataField.isNumeric ? "sum" : "mode");
      return (rows) => {
        return computeColourMethods[colourMethod](
          rows,
          (x) => x[regionsColourDataField.name],
        );
      };
    }
    else {
      return (rows) => {
        return sum(
          rows,
          (x) => x["--mr-scalar"] ?? 1,
        );
      };
    }
  },
);

const regionColoursMapSelector = createKeyedStateSelector(
  (state, mapId) => rowsByRegionSelector(state, mapId),
  (state, mapId) => state.maps[mapId].regionsColourPalette,
  (state, mapId) => regionValueFunctionSelector(state, mapId),
  (state) => colourPalettesSelector(state),
  (
    rowsByRegion,
    regionsColourPaletteName,
    regionValueFunction,
    colourPalettes,
  ) => {
    const domainValues = [];

    const coloursByRegion = {};

    for (const regionId of Object.keys(rowsByRegion)) {
      const regionRows = rowsByRegion[regionId];
      if (regionRows.length) {
        const value = regionValueFunction(regionRows);
        coloursByRegion[regionId] = { value };
        domainValues.push(value);
      }
    }

    const colourPalette = colourPalettes.find((x) => x.name === regionsColourPaletteName);
    if (colourPalette) {
      const domainExtent = extent(domainValues);

      const colourGetter = scaleLinear()
        .domain(domainExtent)
        .range([
          Array.isArray(colourPalette.entries[0]) ? colourPalette.entries[0][1] : colourPalette.entries[0],
          Array.isArray(colourPalette.entries[colourPalette.entries.length - 1]) ? colourPalette.entries[colourPalette.entries.length - 1][1] : colourPalette.entries[colourPalette.entries.length - 1],
        ]);

      for (const regionId of Object.keys(coloursByRegion)) {
        const regionEntry = coloursByRegion[regionId];
        const colour = colourGetter(regionEntry.value);
        regionEntry.colour = colour;
      }
    }

    return coloursByRegion;
  },
);

export default regionColoursMapSelector;
