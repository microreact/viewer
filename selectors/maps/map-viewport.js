import { WebMercatorViewport } from "react-map-gl";

import { createKeyedStateSelector } from "../../utils/state";

import mapStateSelector from "./map-state";
import markersLayerDataSelector from "./markers-layer-data";
import paneSizeSelector from "../panes/pane-size";

const defaultViewportSelector = createKeyedStateSelector(
  (state, mapId) => markersLayerDataSelector(state, mapId),
  (state, mapId) => paneSizeSelector(state, mapId),
  (
    markers,
    size,
  ) => {
    const defaultViewport = new WebMercatorViewport({
      width: size.width,
      height: size.height,
      longitude: 0,
      latitude: 0,
      zoom: 0,
      bearing: 0,
      pitch: 0,
      altitude: 1.5,
    });

    if (markers.length) {
      //#region Find a bounding box which fits all markers
      let north = markers[0];
      let south = markers[0];
      let east = markers[0];
      let west = markers[0];
      for (const marker of markers) {
        if (marker.position[1] > west.position[1]) {
          west = marker;
        }
        if (marker.position[1] < east.position[1]) {
          east = marker;
        }
        if (marker.position[0] > south.position[0]) {
          south = marker;
        }
        if (marker.position[0] < north.position[0]) {
          north = marker;
        }
      }
      //#endregion

      //#region Create a view from the bounding box which fits all markers
      let longitude = defaultViewport.longitude;
      let latitude = defaultViewport.latitude;
      let zoom = defaultViewport.zoom;
      try {
        const newViewport = defaultViewport.fitBounds(
          [
            [
              Number(south.position[0]),
              Number(west.position[1]),
            ],
            [
              Number(north.position[0]),
              Number(east.position[1]),
            ],
          ],
          {
            duration: 0,
            padding: 64,
          },
        );
        longitude = newViewport.longitude;
        latitude = newViewport.latitude;
        zoom = newViewport.zoom;
      }
      catch (error) {
        console.error(error);
      }
      //#endregion

      return {
        altitude: defaultViewport.defaultViewport,
        latitude,
        longitude,
        zoom: Math.max(0, zoom),
        bearing: defaultViewport.defaultViewport,
        pitch: defaultViewport.defaultViewport,
      };
    }

    return undefined;
  },
);

const mapViewportSelector = (state, mapId) => {
  const viewport = mapStateSelector(state, mapId).viewport;
  if (viewport) {
    return viewport;
  }
  else {
    return defaultViewportSelector(state, mapId);
  }
};

export default mapViewportSelector;
