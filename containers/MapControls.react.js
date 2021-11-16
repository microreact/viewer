import { update, setLasso, setTrackViewport } from "../actions/maps";
import dataColumnsSelector from "../selectors/datasets/data-columns";
import { openPaneEditor } from "../actions/ui";

import Component from "../components/MapControls.react";

import regionsColourMethodTypeSelector from "../selectors/maps/regions-colour-method-type";
import maxScaledMarkerRadiusSelector from "../selectors/maps/max-scaled-marker-size";
import minScaledMarkerNodeSelector from "../selectors/maps/min-scaled-marker-size";
import hasGeojsonDataSelector from "../selectors/maps/has-geojson-data";
import colourPalettesSelector from "../selectors/styles/colour-palettes";
import { connectToPresentState } from "../utils/state";
import configSelector from "../selectors/config";

const mapStateToProps = (state, { mapId }) => {
  const mapState = state.maps[mapId];

  return {
    colourPalettes: colourPalettesSelector(state),
    controls: mapState.controls,
    dataFields: dataColumnsSelector(state),
    groupMarkersByRegion: mapState.groupMarkersByRegion,
    hasGeojsonData: hasGeojsonDataSelector(state, mapId),
    isReadOnly: configSelector(state).readOnly,
    lasso: mapState.lasso,
    markersOpacity: mapState.markersOpacity,
    maxNodeSize: mapState.maxNodeSize,
    maxScaledMarkerSize: maxScaledMarkerRadiusSelector(state, mapId),
    minNodeSize: mapState.minNodeSize,
    minScaledMarkerSize: minScaledMarkerNodeSelector(state, mapId),
    nodeSize: mapState.nodeSize,
    regionsColourField: mapState.regionsColourField,
    regionsColourMethod: mapState.regionsColourMethod,
    regionsColourMethodType: regionsColourMethodTypeSelector(state, mapId),
    regionsColourOpacity: mapState.regionsColourOpacity,
    regionsColourPalette: mapState.regionsColourPalette,
    scaleMarkers: mapState.scaleMarkers,
    scaleType: mapState.scaleType,
    showMarkers: mapState.showMarkers,
    showRegionOutlines: mapState.showRegionOutlines,
    showRegions: mapState.showRegions,
    style: mapState.style,
    trackViewport: mapState.trackViewport,
    type: mapState.type,
  };
};

const mapDispatchToProps = (dispatch, { mapId }) => ({
  onControlsChange: (value) => dispatch(update(mapId, "controls", value)),
  onEditPane: () => dispatch(openPaneEditor(mapId)),
  onGroupMarkersByRegionChange: (value) => dispatch(update(mapId, "groupMarkersByRegion", value)),
  onLassoChange: (value) => dispatch(setLasso(mapId, value)),
  onMarkersOpacityChange: (value) => dispatch(update(mapId, "markersOpacity", value)),
  onMaxMarkerSizeChange: (value) => dispatch(update(mapId, "maxMarkerSize", value)),
  onMinMarkerSizeChange: (value) => dispatch(update(mapId, "minMarkerSize", value)),
  onNodeSizeChange: (value) => dispatch(update(mapId, "nodeSize", Number(value))),
  onRegionsColourFieldChange: (value) => dispatch(update(mapId, "regionsColourField", value)),
  onRegionsColourMethodChange: (value) => dispatch(update(mapId, "regionsColourMethod", value)),
  onRegionsColourOpacityChange: (value) => dispatch(update(mapId, "regionsColourOpacity", value)),
  onRegionsColourPaletteChange: (value) => dispatch(update(mapId, "regionsColourPalette", value)),
  onScaleMarkersChange: (value) => dispatch(update(mapId, "scaleMarkers", value)),
  onScaleTypeChange: (value) => dispatch(update(mapId, "scaleType", value)),
  onShowMarkersChange: (value) => dispatch(update(mapId, "showMarkers", value)),
  onShowRegionOutlinesChange: (value) => dispatch(update(mapId, "showRegionOutlines", value)),
  onShowRegionsChange: (value) => dispatch(update(mapId, "showRegions", value)),
  onShowTileLayerSettings: () => dispatch(update(mapId, "tileLayerDialog", true)),
  onStyleChange: (value) => dispatch(update(mapId, "style", value)),
  onTrackViewportChange: (value) => dispatch(setTrackViewport(mapId, value)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
