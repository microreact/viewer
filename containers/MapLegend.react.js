import { connect } from "react-redux";

import { selectRows } from "../actions/filters";
import { update } from "../actions/maps";

import markerSizeLegendItemsSelector from "../selectors/maps/marker-size-legend-items";
import maxScaledMarkerRadiusSelector from "../selectors/maps/max-scaled-marker-size";
import minScaledMarkerNodeSelector from "../selectors/maps/min-scaled-marker-size";

import MapLegend from "../components/MapLegend.react";
import scaleMarkersFieldSelector from "../selectors/maps/scale-markers-field";
import markersLayerDataSelector from "../selectors/maps/markers-layer-data";
import regionColourLegendItemsSelector from "../selectors/maps/region-colour-legend-items";
import hasMarkerSizeLegendSelector from "../selectors/maps/has-marker-size-legend";
import hasRegionColourLegendSelector from "../selectors/maps/has-region-colour-legend";

const mapStateToProps = (state, { mapId }) => {
  const hasMarkerSizeLegend = hasMarkerSizeLegendSelector(state, mapId);
  const hasRegionColourLegend = hasRegionColourLegendSelector(state, mapId);
  return {
    hasMarkerSizeLegend,
    hasRegionColourLegend,
    markers: markersLayerDataSelector(state, mapId),
    markerSizeLegendItems: hasMarkerSizeLegend ? markerSizeLegendItemsSelector(state, mapId) : null,
    maxScaledMarkerSize: maxScaledMarkerRadiusSelector(state, mapId),
    minScaledMarkerSize: minScaledMarkerNodeSelector(state, mapId),
    regionColourLegendItems: hasRegionColourLegend ? regionColourLegendItemsSelector(state, mapId) : null,
    scaleMarkersDataField: scaleMarkersFieldSelector(state, mapId),
  };
};

const mapDispatchToProps = (dispatch, { mapId }) => {
  return {
    onSelectRows: (ids, merge) => dispatch(selectRows(ids, merge)),
    onMinMarkerSizeChange: (value) => dispatch(update(mapId, "minMarkerSize", value)),
    onMaxMarkerSizeChange: (value) => dispatch(update(mapId, "maxMarkerSize", value)),
  };
};

export default connect((state, props) => mapStateToProps(state.present, props), mapDispatchToProps)(MapLegend);
