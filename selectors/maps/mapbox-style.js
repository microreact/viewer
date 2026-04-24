import { createKeyedStateSelector } from "../../utils/state.js";
import configSelector from "../config.js";

import mapStyleTypeSelector from "./style-type.js";
import { isMapboxStyleUrl } from "../../utils/mapbox.js";

const vectorStyleDefinitions = {
  basic: "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json",
  bright: "https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  // streets: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
};

const rasterStyleDefinitions = {
  satellite: {
    attribution: "Tiles &copy; Esri",
    tiles: [ "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" ],
  },
};

const mapboxStyles = {
  streets: "mapbox://styles/mapbox/streets-v9",
};

function createRasterStyle(name) {
  const definition = rasterStyleDefinitions[name];

  return {
    version: 8,
    sources: {
      basemap: {
        type: "raster",
        attribution: definition.attribution,
        tileSize: 256,
        tiles: definition.tiles,
      },
    },
    layers: [
      {
        id: "basemap",
        type: "raster",
        source: "basemap",
      },
    ],
  };
}

function isStyleUrl(style) {
  return (
    typeof style === "string"
    &&
    (
      isMapboxStyleUrl(style)
      ||
      /^https?:\/\//i.test(style)
      ||
      style.startsWith("/")
      ||
      style.endsWith(".json")
    )
  );
}

function createStyle(style) {
  if (typeof style !== "string") {
    return style;
  }

  if (isStyleUrl(style)) {
    return style;
  }

  if (style in mapboxStyles) {
    return mapboxStyles[style];
  }

  if (style in vectorStyleDefinitions) {
    return vectorStyleDefinitions[style];
  }

  if (style in rasterStyleDefinitions) {
    return createRasterStyle(style);
  }

  return vectorStyleDefinitions.light;
}

// const categories = [ "labels", "roads", "buildings", "parks", "water", "background" ];
// const layerSelector = {
//   background: /background/,
//   water: /water/,
//   parks: /park/,
//   buildings: /building/,
//   roads: /bridge|road|tunnel/,
//   labels: /label|place|poi/
// };

const mapboxStyleSelector = createKeyedStateSelector(
  (state, mapId) => mapStyleTypeSelector(state, mapId),
  (state) => configSelector(state).mapVectorFiles ?? `${location.origin}/public/vector`, // eslint-disable-line no-restricted-globals, no-undef
  (
    style,
    mapVectorFiles,
  ) => {
    if (style === "microreact") {
      const mapboxStyle = {
        version: 8,
        sources: {
          countries: {
            type: "vector",
            // "url": "mapbox://map-id"
            // "url": "http://tileserver.com/layer.json",
            tiles: [ `${mapVectorFiles}/tiles/{z}/{x}/{y}.pbf` ],
            maxzoom: 6,
          },
        },
        glyphs: `${mapVectorFiles}/glyphs/{fontstack}/{range}.pbf`,
        layers: [
          {
            id: "background",
            type: "background",
            paint: {
              "background-color": "#cad2d3",
            },
          },
          {
            "id": "country-glow-outer",
            "type": "line",
            "source": "countries",
            "source-layer": "country",
            "layout": {
              "line-join": "round",
            },
            "paint": {
              "line-color": "#226688",
              "line-width": 5,
              "line-opacity": {
                stops: [[0, 0], [1, 0.1]],
              },
            },
          }, {
            "id": "country-glow-inner",
            "type": "line",
            "source": "countries",
            "source-layer": "country",
            "layout": {
              "line-join": "round",
            },
            "paint": {
              "line-color": "#226688",
              "line-width": {
                stops: [[0, 1.2], [1, 1.6], [2, 2], [3, 2.4]],
              },
              "line-opacity": 0.8,
            },
            // rainbow start
          },
          {
            "id": "area-white",
            "type": "fill",
            "source": "countries",
            // "filter":["in","ADM0_A3",'ATA'],
            "source-layer": "country",
            "paint": {
              "fill-color": "#efefee",
            },
          },
          {
            "id": "geo-lines",
            "type": "line",
            "source": "countries",
            "source-layer": "geo-lines",
            "paint": {
              "line-color": "#226688",
              "line-width": {
                stops: [[0, 0.2], [4, 1]],
              },
              "line-dasharray": [6, 2],
            },
          }, {
            "id": "land-border-country",
            "type": "line",
            "source": "countries",
            "source-layer": "land-border-country",
            "paint": {
              "line-color": "#fff",
              "line-width": {
                base: 1.5,
                stops: [[0, 0], [1, 0.8], [2, 1]],
              },
            },
          }, {
            "id": "state",
            "type": "line",
            "source": "countries",
            "source-layer": "state",
            "minzoom": 3,
            "filter": ["in", "ADM0_A3", "USA", "CAN", "AUS"],
            "paint": {
              "line-color": "#226688",
              "line-opacity": 0.25,
              "line-dasharray": [6, 2, 2, 2],
              "line-width": 1.2,
            },
            // LABELS
          },
          {
            "id": "country-abbrev",
            "type": "symbol",
            "source": "countries",
            "source-layer": "country-name",
            "minzoom": 1.8,
            "maxzoom": 3,
            "layout": {
              "text-field": "{ABBREV}",
              "text-font": ["Open Sans Semibold"],
              "text-transform": "uppercase",
              "text-max-width": 20,
              "text-size": {
                stops: [[3, 10], [4, 11], [5, 12], [6, 16]],
              },
              "text-letter-spacing": {
                stops: [[4, 0], [5, 1], [6, 2]],
              },
              "text-line-height": {
                stops: [[5, 1.2], [6, 2]],
              },
            },
            "paint": {
              "text-halo-color": "#fff",
              "text-halo-width": 1.5,
            },
          }, {
            "id": "country-name",
            "type": "symbol",
            "source": "countries",
            "source-layer": "country-name",
            "minzoom": 3,
            "layout": {
              "text-field": "{NAME}",
              "text-font": ["Open Sans Semibold"],
              "text-transform": "uppercase",
              "text-max-width": 20,
              "text-size": {
                stops: [[3, 10], [4, 11], [5, 12], [6, 16]],
              },
            },
            "paint": {
              "text-halo-color": "#fff",
              "text-halo-width": 1.5,
            },
          }, {
            "id": "geo-lines-lables",
            "type": "symbol",
            "source": "countries",
            "source-layer": "geo-lines",
            "minzoom": 1,
            "layout": {
              "text-field": "{DISPLAY}",
              "text-font": ["Open Sans Semibold"],
              "text-offset": [0, 1],
              "symbol-placement": "line",
              "symbol-spacing": 600,
              "text-size": 9,
            },
            "paint": {
              "text-color": "#226688",
              "text-halo-width": 1.5,
            },
          }],
      };
      return mapboxStyle;
      // const visibility = {
      //   water: false,
      //   parks: true,
      //   buildings: true,
      //   roads: true,
      //   labels: true,
      //   background: true,
      // };
      // for (const layer of mapboxStyle.layers) {
      //   return categories.every(name => visibility[name] || !layerSelector[name].test(layer.id));
      // }
      // mapboxStyle.layers = mapboxStyle.layers.filter(layer => {
      //   return categories.every(name => visibility[name] || !layerSelector[name].test(layer.id));
      // })
      // return mapboxStyle;
    }
    return createStyle(style ?? "light");
  },
);

export default mapboxStyleSelector;
