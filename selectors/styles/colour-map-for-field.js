import { scaleLinear } from "d3-scale";
import { extent } from "d3-array";

import { createKeyedStateSelector } from "../../utils/state";

import colourPaletteForFieldSelector from "./colour-palette-for-field";
import uniqueValuesSelector from "../datasets/unique-values";
import dataColumnByFieldSelector from "../datasets/data-column-by-field";
import colourModeForFieldSelector from "./colour-mode-for-field";

const discreteValueToColourMapSelector = createKeyedStateSelector(
  (state, field) => dataColumnByFieldSelector(state, field),
  (state, field) => colourPaletteForFieldSelector(state, field),
  (state, field) => ((colourPaletteForFieldSelector(state, field)?.type !== "custom") ? uniqueValuesSelector(state, field) : undefined),
  (state) => state.styles.defaultColour,
  (
    dataColumn,
    palette,
    uniqueFieldValues,
    defaultColour,
  ) => {
    const colourMap = new Map();

    if (palette.type === "custom") {
      for (const item of palette.entries) {
        colourMap.set(
          item[0],
          item[1],
        );
      }
    }
    else {
      let index = 0;
      for (const rawValue of uniqueFieldValues) {
        // console.log({rawValue})
        const value = rawValue?.valueOf();
        if ((value ?? undefined) !== undefined) {
          const colour = palette.entries[index % palette.entries.length];
          colourMap.set(
            value,
            colour,
          );
          index += 1;
        }
        else {
          colourMap.set(
            value,
            defaultColour,
          );
        }
      }
    }

    colourMap.scale = "discrete";

    return colourMap;
  },
);

const continuousValueToColourMapSelector = createKeyedStateSelector(
  (state, field) => colourPaletteForFieldSelector(state, field),
  (state, field) => uniqueValuesSelector(state, field),
  (
    palette,
    uniqueValues,
  ) => {
    const domainExtent = extent(uniqueValues);

    const range = (
      (palette.type === "custom")
        ?
        [
          palette.entries[0][1],
          palette.entries[palette.entries.length - 1][1],
        ]
        :
        [
          palette.entries[0],
          palette.entries[palette.entries.length - 1],
        ]
    );

    const colourGetter = scaleLinear()
      .domain(domainExtent)
      .range(range);

    const colourMap = new Map();

    for (const value of uniqueValues) {
      colourMap.set(
        value,
        colourGetter(value),
      );
    }

    colourMap.scale = "continuous";
    colourMap.domain = domainExtent;
    colourMap.range = range;

    return colourMap;
  },
);

const binnedValueToColourMapSelector = createKeyedStateSelector(
  (state, field) => colourPaletteForFieldSelector(state, field),
  (state, field) => uniqueValuesSelector(state, field),
  (
    palette,
    uniqueValues,
  ) => {
    const domainExtent = extent(uniqueValues);

    const range = (
      (palette.type === "custom")
        ?
        [
          palette.entries[0][1],
          palette.entries[palette.entries.length - 1][1],
        ]
        :
        [
          palette.entries[0],
          palette.entries[palette.entries.length - 1],
        ]
    );
    const numberOfBins = palette.bins ?? palette.entries.length;
    const binLength = Math.abs(domainExtent[1] - domainExtent[0]) / numberOfBins;

    const colourGetter = scaleLinear()
      .domain([ 1, numberOfBins ])
      .range(range);

    const colourMap = new Map();

    for (const value of uniqueValues) {
      const binIndex = Math.floor((value - domainExtent[0]) / binLength);
      colourMap.set(
        value,
        colourGetter(binIndex),
      );
    }

    colourMap.scale = "binned";
    colourMap.numberOfBins = numberOfBins;
    colourMap.binLength = binLength;
    colourMap.colourGetter = colourGetter;
    colourMap.domain = domainExtent;
    colourMap.range = range;

    return colourMap;
  },
);

function colourMapForFieldSelector(state, field) {
  const dataColumn = dataColumnByFieldSelector(state, field);
  const colourPalette = colourPaletteForFieldSelector(state, field);
  const colourMode = colourModeForFieldSelector(state, field);

  if (!dataColumn) {
    return new Map();
  }

  if (colourPalette && dataColumn?.isNumeric && colourMode === "gradient") {
    if (colourPalette.bins > 0 || colourPalette.entries.length > 2) {
      return binnedValueToColourMapSelector(state, field);
    }
    else if (colourPalette.bins === 0 || colourPalette.entries.length === 2) {
      return continuousValueToColourMapSelector(state, field);
    }
    else {
      return continuousValueToColourMapSelector(state, field);
    }
  }

  return discreteValueToColourMapSelector(state, field);
}

export default colourMapForFieldSelector;
