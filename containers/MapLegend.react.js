import { selectRows } from "../actions/filters";
import { update } from "../actions/maps";

import markerSizeLegendItemsSelector from "../selectors/maps/marker-size-legend-items";
import maxScaledMarkerRadiusSelector from "../selectors/maps/max-scaled-marker-size";
import minScaledMarkerNodeSelector from "../selectors/maps/min-scaled-marker-size";

import MapLegend from "../components/MapLegend.react";
import scaleMarkersFieldSelector from "../selectors/maps/scale-markers-field";
import markersLayerDataSelector from "../selectors/maps/markers-layer-data";
import hasMarkerSizeLegendSelector from "../selectors/maps/has-marker-size-legend";
import hasRegionColourLegendSelector from "../selectors/maps/has-region-colour-legend";
import { connectToPresentState } from "../utils/state";

const mapStateToProps = (state, { mapId }) => {
  const hasMarkerSizeLegend = hasMarkerSizeLegendSelector(state, mapId);
  const hasRegionColourLegend = hasRegionColourLegendSelector(state, mapId);
  const mapState = state.maps[mapId];
  return {
    hasMarkerSizeLegend,
    hasRegionColourLegend,
    markers: markersLayerDataSelector(state, mapId),
    markerSizeLegendItems: hasMarkerSizeLegend ? markerSizeLegendItemsSelector(state, mapId) : null,
    maxScaledMarkerSize: maxScaledMarkerRadiusSelector(state, mapId),
    minScaledMarkerSize: minScaledMarkerNodeSelector(state, mapId),
    nodeSize: mapState.nodeSize,
    scaleMarkersDataField: scaleMarkersFieldSelector(state, mapId),
  };
};

const mapDispatchToProps = (dispatch, { mapId }) => {
  return {
    onMaxMarkerSizeChange: (value) => dispatch(update(mapId, "maxMarkerSize", value)),
    onMinMarkerSizeChange: (value) => dispatch(update(mapId, "minMarkerSize", value)),
    onNodeSizeChange: (value) => dispatch(update(mapId, "nodeSize", Number(value))),
    onSelectRows: (ids, merge) => dispatch(selectRows(ids, merge)),
  };
};

export default connectToPresentState(
  MapLegend,
  mapStateToProps,
  mapDispatchToProps,
);
