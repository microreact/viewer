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
import { emptyArray } from "../../constants";
import mapStateSelector from "./map-state";
import rowsByRegionSelector from "./rows-by-region";
import totalRowCountByRegionSelector from "./total-row-count-by-region";

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

const regionColoursSelector = createKeyedStateSelector(
  (state, mapId) => rowsByRegionSelector(state, mapId),
  (state, mapId) => regionValueFunctionSelector(state, mapId),
  (state, mapId) => regionsColourPaletteSelector(state, mapId),
  (state, mapId) => state.maps[mapId].regionsColourScale,
  (state, mapId) => state.maps[mapId].regionsColourMethod,
  (state, mapId) => totalRowCountByRegionSelector(state, mapId),
  (
    rowsByRegion,
    regionValueFunction,
    colourPalette,
    regionsColourScale,
    regionsColourMethod,
    totalRowCountByRegion,
  ) => {
    const coloursByRegionId = {};
    const valuesByRegionId = {};
    // const domainValues = [];
    const legendEntries = [];
    // const type = regionsColourScale ?? "gradient";
    const showProportions = (regionsColourMethod === "proportion");
    let hasProportions = false;

    if (colourPalette) {
      for (const [ regionId, regionRows ] of Object.entries(rowsByRegion)) {
        if (regionRows.length) {
          if (showProportions) {
            const value = regionRows.length;
            const total = totalRowCountByRegion[regionId];
            if (value !== total) {
              hasProportions = true;
              valuesByRegionId[regionId] = (value / total) * 100;
            }
            else {
              valuesByRegionId[regionId] = value;
            }
          }
          else {
            const value = regionValueFunction(regionRows);
            valuesByRegionId[regionId] = value;
          }
        }
      }

      const domainExtent = extent(Object.values(valuesByRegionId));

      let domain;
      let colourGetter;
      if (regionsColourScale === "binned") {
        const colorRange = colourPalette.entries;
        // [
        //   "#f7fcfd",
        //   "#e0ecf4",
        //   "#bfd3e6",
        //   "#9ebcda",
        //   "#8c96c6",
        //   "#8c6bb1",
        //   "#88419d",
        //   "#810f7c",
        //   "#4d004b",
        // ];
        // const colorRange = [
        //   "grey",
        //   "grey",
        //   "#ee82ee",
        //   "#0000ff",
        //   "#00ffff",
        //   "#008000",
        //   "#ffff00",
        //   "#ffa500",
        //   "#ff0000",
        //   "#000000",
        // ];
        if (showProportions) {
          domain = ticks(domainExtent[0], domainExtent[1], colorRange.length);
        }
        else {
          domain = [
            // 1,
            10,
            50,
            100,
            500,
            1000,
            5000,
            10000,
            50000,
          ];
        }
        colourGetter = scaleThreshold()
          .domain(domain)
          .range(colorRange);
      }
      else {
        domain = domainExtent;
        const range = [
          Array.isArray(colourPalette.entries[0]) ? colourPalette.entries[0][1] : colourPalette.entries[0],
          Array.isArray(colourPalette.entries[colourPalette.entries.length - 1]) ? colourPalette.entries[colourPalette.entries.length - 1][1] : colourPalette.entries[colourPalette.entries.length - 1],
        ];
        colourGetter = scaleLinear()
          .domain(domain)
          .range(range);
      }

      for (const value of domain) {
        legendEntries.push({
          "value": hasProportions ? `${value}%` : value,
          "colour": colourGetter(value),
        });
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

      for (const [ regionId, value ] of Object.entries(valuesByRegionId)) {
        const colour = colourGetter(value);
        coloursByRegionId[regionId] = colour;
      }
    }

    return {
      coloursByRegionId,
      legendEntries,
    };
  },
);

export default regionColoursSelector;
