// import randomcolor from "randomcolor";
import { scaleLinear, scaleThreshold } from "d3-scale";
import {
  extent,
  max,
  mean,
  median,
  min,
  sum,
  count,
  ticks,
} from "d3-array";

import {
  mode,
  uniqueElements,
} from "../../utils/arrays";
import { createKeyedStateSelector } from "../../utils/state";

import colourPaletteByNameSelector from "../styles/colour-palette-by-name";
import dataColumnByFieldSelector from "../datasets/data-column-by-field";
import { emptyArray } from "../../constants";
import mapStateSelector from "./map-state";
import rowsByRegionSelector from "./rows-by-region";

const computeColourMethods = {
  max,
  mean,
  median,
  min,
  mode,
  sum,
  unique: (array, valueOf) => uniqueElements(array, valueOf).length,
  value: (array, valueOf, value) => count(array, (x) => (valueOf(x) === value ? 1 : undefined)),
};

// const regionsColourColumnSelector = (state, mapId) => {
//   const mapState = mapStateSelector(state, mapId);
//   return dataColumnByFieldSelector(state, mapState.regionsColourField);
// };

const regionsColourPaletteSelector = (state, mapId) => {
  const mapState = mapStateSelector(state, mapId);
  return colourPaletteByNameSelector(state, mapState.regionsColourPalette);
};

const regionValueFunctionSelector = createKeyedStateSelector(
  (state, mapId) => state.maps[mapId].regionsColourMethod,
  (state, mapId) => state.maps[mapId].regionsColourField,
  (state, mapId) => state.maps[mapId].regionsColourValues ?? emptyArray,
  (
    regionsColourMethod,
    regionsColourField,
    regionsColourValues,
  ) => {
    if (regionsColourField && regionsColourMethod) {
      switch (regionsColourMethod) {
        case "max":
          return (
            (rows) => max(
              rows,
              (x) => x[regionsColourField],
            )
          );
        case "mean":
          return (
            (rows) => mean(
              rows,
              (x) => x[regionsColourField],
            )
          );
        case "median":
          return (
            (rows) => median(
              rows,
              (x) => x[regionsColourField],
            )
          );
        case "min":
          return (
            (rows) => min(
              rows,
              (x) => x[regionsColourField],
            )
          );
        case "mode":
          return (
            (rows) => mode(
              rows,
              (x) => x[regionsColourField],
            )
          );
        case "sum":
          return (
            (rows) => sum(
              rows,
              (x) => x[regionsColourField],
            )
          );
        case "unique":
          return (
            (rows) => uniqueElements(
              rows,
              (x) => x[regionsColourField],
            ).length
          );
        case "value":
          return (
            (rows) => count(
              rows,
              (x) => (regionsColourValues.includes(x[regionsColourField]) || undefined),
            )
          );
      }
    }

    return (
      (rows) => sum(
        rows,
        (x) => x["--mr-scalar"] ?? 1,
      )
    );
  },
);

const regionColoursMapSelector = createKeyedStateSelector(
  (state, mapId) => rowsByRegionSelector(state, mapId),
  (state, mapId) => regionValueFunctionSelector(state, mapId),
  (state, mapId) => regionsColourPaletteSelector(state, mapId),
  (state, mapId) => state.maps[mapId].regionsColourScale,
  (
    rowsByRegion,
    regionValueFunction,
    colourPalette,
    regionsColourScale,
  ) => {
    const domainValues = [];
    const coloursByRegion = {};
    const coloursLegend = [];
    const type = regionsColourScale ?? "gradient";

    if (colourPalette) {
      for (const [ regionId, regionRows ] of Object.entries(rowsByRegion)) {
        if (regionRows.length) {
          const value = regionValueFunction(regionRows);
          coloursByRegion[regionId] = { value };
          domainValues.push(value);
        }
      }

      const domainExtent = extent(domainValues);

      let colourGetter;
      if (regionsColourScale === "binned") {
        const colorRange = colourPalette.entries;
        const domain = ticks(domainExtent[0], domainExtent[1], colorRange.length);
        colourGetter = scaleThreshold()
          .domain(domain)
          .range(colorRange);

        for (const value of domain) {
          coloursLegend.push({ value, colour: colourGetter(value) });
        }
      }
      else {
        const domain = domainExtent;
        const range = [
          Array.isArray(colourPalette.entries[0]) ? colourPalette.entries[0][1] : colourPalette.entries[0],
          Array.isArray(colourPalette.entries[colourPalette.entries.length - 1]) ? colourPalette.entries[colourPalette.entries.length - 1][1] : colourPalette.entries[colourPalette.entries.length - 1],
        ];
        colourGetter = scaleLinear()
          .domain(domain)
          .range(range);
        for (const value of domain) {
          coloursLegend.push({ value, colour: colourGetter(value) });
        }
      }

      // const colorRange = [
      //   "#ffffcc",
      //   "#ffeda0",
      //   "#fed976",
      //   "#feb24c",
      //   "#fd8d3c",
      //   "#fc4e2a",
      //   "#e31a1c",
      //   "#bd0026",
      //   "#800026",
      // ];

      for (const regionEntry of Object.values(coloursByRegion)) {
        const colour = colourGetter(regionEntry.value);
        regionEntry.colour = colour;
      }
    }

    return {
      coloursByRegion,
      coloursLegend,
      type,
    };
  },
);

export default regionColoursMapSelector;
