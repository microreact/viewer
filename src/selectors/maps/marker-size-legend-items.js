import { createKeyedStateSelector } from "../../utils/state";

import markersLayerDataSelector from "./markers-layer-data";
import mapStateSelector from "./map-state";
import maxScaledMarkerRadiusSelector from "./max-scaled-marker-size";
import minScaledMarkerNodeSelector from "./min-scaled-marker-size";

const numberOfMarks = {
  1: [ 1 ],
  2: [ 0, 1 ],
  3: [ 0, 0.5, 1 ],
  4: [ 0, 0.33, 0.67, 1 ],
  5: [ 0, 0.25, 0.5, 0.75, 1 ],
};

const markerSizeLegendItemsSelector = createKeyedStateSelector(
  (state, mapId) => markersLayerDataSelector(state, mapId),
  (state, mapId) => minScaledMarkerNodeSelector(state, mapId) / 2,
  (state, mapId) => maxScaledMarkerRadiusSelector(state, mapId) / 2,
  (
    markers,
    minScaledMarkerRadius,
    maxScaledMarkerRadius,
  ) => {
    const markersByMagnitude = new Map();
    for (const marker of markers) {
      if (marker.magnitude) {
        markersByMagnitude.set(marker.magnitude, marker);
      }
    }

    const orderedMarks = Array.from(markersByMagnitude.keys()).sort((a, b) => (a - b));

    const items = [];
    const radiusRange = maxScaledMarkerRadius - minScaledMarkerRadius;

    if (orderedMarks.length > 0) {
      const marks = numberOfMarks[Math.min(5, orderedMarks.length)];
      for (const mark of marks) {
        const index = Math.round(mark * (orderedMarks.length - 1));
        const value = orderedMarks[index];
        items.push({
          value,
          radius: minScaledMarkerRadius + radiusRange * markersByMagnitude.get(value).ratio,
        });
      }
    }

    return items;
  }
);

export default markerSizeLegendItemsSelector;
