import { selectRows } from "../actions/filters";
import {
  setFilter,
  setViewport,
  selectRegion,
} from "../actions/maps";

import configSelector from "../selectors/config";
import hasMarkerSizeLegendSelector from "../selectors/maps/has-marker-size-legend";
import hasRegionColourLegendSelector from "../selectors/maps/has-region-colour-legend";
import mapboxStyleSelector from "../selectors/maps/mapbox-style";
import mapViewportSelector from "../selectors/maps/map-viewport";

import Component from "../components/MapPane.react";
import markersLayerDataSelector from "../selectors/maps/markers-layer-data";
import { connectToPresentState } from "../utils/state";

function mapStateToProps(state, { mapId }) {
  const mapState = state.maps[mapId];
  return {
    controls: mapState.controls,
    hideScaleControl: mapState.hideScaleControl,
    hasLegend: hasMarkerSizeLegendSelector(state, mapId) || hasRegionColourLegendSelector(state, mapId),
    mapboxApiAccessToken: mapState.mapboxApiAccessToken || configSelector(state).mapboxApiAccessToken,
    mapboxStyle: mapboxStyleSelector(state, mapId),
    markers: markersLayerDataSelector(state, mapId),
    showMarkers: mapState.showMarkers,
    showRegions: !!mapState.geodata && mapState.showRegions,
    trackViewport: mapState.trackViewport,
    viewport: mapViewportSelector(state, mapId),
  };
}

function mapDispatchToProps(dispatch, { mapId }) {
  return {
    onPathChange: (path) => dispatch(setFilter(mapId, path)),
    onViewportChange: (viewport) => dispatch(setViewport(mapId, viewport)),
    onSelectRows: (ids, merge) => dispatch(selectRows(ids, merge)),
    onSelectRegion: (region, merge) => dispatch(selectRegion(mapId, region, merge)),
  };
}

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
