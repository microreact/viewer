import { createKeyedStateSelector } from "../../utils/state";
import configSelector from "../config";

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
  (state, mapId) => state.maps[mapId].style || configSelector(state)?.maps?.style,
  (
    style,
  ) => {
    if (style === "microreact") {
      const mapboxStyle = {
        version: 8,
        sources: {
          countries: {
            type: "vector",
            // "url": "mapbox://map-id"
            // "url": "http://tileserver.com/layer.json",
            tiles: [ `${location.origin}/public/vector/tiles/{z}/{x}/{y}.pbf` ],
            maxzoom: 6,
          },
        },
        glyphs: `${location.origin}/public/vector/glyphs/{fontstack}/{range}.pbf`,
        layers: [
          {
            id: "background",
            type: "background",
            paint: {
              "background-color": "#cad2d3",
            },
          },
          {
            id: "country-glow-outer",
            type: "line",
            source: "countries",
            "source-layer": "country",
            layout: {
              "line-join": "round",
            },
            paint: {
              "line-color": "#226688",
              "line-width": 5,
              "line-opacity": {
                stops: [[0, 0], [1, 0.1]],
              },
            },
          }, {
            id: "country-glow-inner",
            type: "line",
            source: "countries",
            "source-layer": "country",
            layout: {
              "line-join": "round",
            },
            paint: {
              "line-color": "#226688",
              "line-width": {
                stops: [[0, 1.2], [1, 1.6], [2, 2], [3, 2.4]],
              },
              "line-opacity": 0.8,
            },
            // rainbow start
          },
          {
            id: "area-white",
            type: "fill",
            source: "countries",
            // "filter":["in","ADM0_A3",'ATA'],
            "source-layer": "country",
            paint: {
              "fill-color": "#efefee",
            },
          },
          {
            id: "geo-lines",
            type: "line",
            source: "countries",
            "source-layer": "geo-lines",
            paint: {
              "line-color": "#226688",
              "line-width": {
                stops: [[0, 0.2], [4, 1]],
              },
              "line-dasharray": [6, 2],
            },
          }, {
            id: "land-border-country",
            type: "line",
            source: "countries",
            "source-layer": "land-border-country",
            paint: {
              "line-color": "#fff",
              "line-width": {
                base: 1.5,
                stops: [[0, 0], [1, 0.8], [2, 1]],
              },
            },
          }, {
            id: "state",
            type: "line",
            source: "countries",
            "source-layer": "state",
            minzoom: 3,
            filter: ["in", "ADM0_A3", "USA", "CAN", "AUS"],
            paint: {
              "line-color": "#226688",
              "line-opacity": 0.25,
              "line-dasharray": [6, 2, 2, 2],
              "line-width": 1.2,
            },
            // LABELS
          },
          {
            id: "country-abbrev",
            type: "symbol",
            source: "countries",
            "source-layer": "country-name",
            minzoom: 1.8,
            maxzoom: 3,
            layout: {
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
            paint: {
              "text-halo-color": "#fff",
              "text-halo-width": 1.5,
            },
          }, {
            id: "country-name",
            type: "symbol",
            source: "countries",
            "source-layer": "country-name",
            minzoom: 3,
            layout: {
              "text-field": "{NAME}",
              "text-font": ["Open Sans Semibold"],
              "text-transform": "uppercase",
              "text-max-width": 20,
              "text-size": {
                stops: [[3, 10], [4, 11], [5, 12], [6, 16]],
              },
            },
            paint: {
              "text-halo-color": "#fff",
              "text-halo-width": 1.5,
            },
          }, {
            id: "geo-lines-lables",
            type: "symbol",
            source: "countries",
            "source-layer": "geo-lines",
            minzoom: 1,
            layout: {
              "text-field": "{DISPLAY}",
              "text-font": ["Open Sans Semibold"],
              "text-offset": [0, 1],
              "symbol-placement": "line",
              "symbol-spacing": 600,
              "text-size": 9,
            },
            paint: {
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
    else {
      return `mapbox://styles/mapbox/${style || "light"}-v9`;
    }
  },
);

export default mapboxStyleSelector;
