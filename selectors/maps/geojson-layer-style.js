import { createKeyedStateSelector } from "../../utils/state";

import geojsonLayerDataSelector from "./geojson-layer-data";
import mapStateSelector from "./map-state";
import regionColoursMapSelector from "./regions-colours-map";

// function defaultValueFunction(rows) {
//   return rows.length;
// }

// const computeColourMethods = {
//   max,
//   mean,
//   median,
//   min,
//   mode,
//   sum,
//   first: firstElement,
//   last: lastElement,
//   unique: uniqueElementsCount,
// };

// const regionValueFunctionSelector = createKeyedStateSelector(
//   (state) => fieldsMapSelector(state),
//   (state, mapId) => state.maps[mapId].regionsColourField,
//   (state, mapId) => state.maps[mapId].regionsColourMethod,
//   (
//     fieldsMap,
//     regionsColourFieldName,
//     regionsColourMethod,
//   ) => {
//     if (regionsColourFieldName) {
//       const regionsColourDataField = fieldsMap.get(regionsColourFieldName);
//       const colourMethod = regionsColourMethod || (regionsColourDataField.isNumeric ? "sum" : "mode");
//       return (rows) => {
//         return computeColourMethods[colourMethod](
//           rows,
//           (x) => x[regionsColourDataField.name],
//         );
//       };
//     }
//     else {
//       return defaultValueFunction;
//     }
//   },
// );

// const regionColourFunctionSelector = createKeyedStateSelector(
//   (state, mapId) => rowsByRegionSelector(state, mapId),
//   // (state, mapId) => state.maps[mapId].regionsColourField,
//   (state, mapId) => state.maps[mapId].regionsColourPalette,
//   (state, mapId) => regionValueFunctionSelector(state, mapId),
//   (
//     rowsByRegion,
//     // regionsColourFieldName,
//     regionsColourPaletteName,
//     regionValueFunction,
//   ) => {
//     const domainValues = [];

//     for (const regionId of Object.keys(rowsByRegion)) {
//       const regionRows = rowsByRegion[regionId];
//       if (regionRows.length) {
//         const value = regionValueFunction(regionRows);
//         domainValues.push(value);
//       }
//     }

//     const colourPalette = colourRanges.find((x) => x.name === regionsColourPaletteName);

//     const colourGetter = scaleLinear()
//       .domain(extent(domainValues))
//       .range([ colourPalette.entries[0], colourPalette.entries[colourPalette.entries.length - 1] ]);

//     return (rows) => (rows.length ? colourGetter(regionValueFunction(rows)) : "transparent");
//   },
// );

const geojsonLayerStyleSelector = createKeyedStateSelector(
  (state, mapId) => geojsonLayerDataSelector(state, mapId),
  (state, mapId) => regionColoursMapSelector(state, mapId),
  (state, mapId) => mapStateSelector(state, mapId).showRegionOutlines,
  (state, mapId) => mapStateSelector(state, mapId).regionsColourOpacity,
  (
    geojson,
    regionColours,
    showRegionOutlines,
    regionsColourOpacity,
  ) => {
    const color = {
      property: "mr-region-id",
      stops: [],
    };

    for (const feature of geojson.features) {
      color.stops.push([
        feature.properties["mr-region-id"],
        regionColours[feature.properties["mr-region-id"]]?.colour ?? "transparent",
      ]);
    }

    const style = {
      "fill-color": color,
      "fill-opacity": regionsColourOpacity / 100,
      "fill-outline-color": showRegionOutlines ? "rgba(0, 0, 0, 1)" : color,
    };

    if (regionsColourOpacity === 0) {
      style["fill-opacity"] = 100;
      style["fill-color"] = "rgba(0, 0, 0, 0)";
    }

    return style;
  },
);

export default geojsonLayerStyleSelector;
