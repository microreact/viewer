import MapMarkersLayer from "../components/MapMarkersLayer.react";
import { connectToPresentStateWithRef } from "../utils/state";

import maxScaledMarkerRadiusSelector from "../selectors/maps/max-scaled-marker-size";
import minScaledMarkerNodeSelector from "../selectors/maps/min-scaled-marker-size";
import selectedIdsSetSelector from "../selectors/filters/selected-ids-set";
import markersLayerDataSelector from "../selectors/maps/markers-layer-data";

const mapStateToProps = (state, { mapId }) => {
  const mapState = state.maps[mapId];
  return ({
    fixedSize: !mapState.scaleMarkers,
    markers: markersLayerDataSelector(state, mapId),
    nodeRadius: mapState.nodeSize / 2,
    minScaledMarkerSize: minScaledMarkerNodeSelector(state, mapId),
    maxScaledMarkerSize: maxScaledMarkerRadiusSelector(state, mapId),
    selectedIds: selectedIdsSetSelector(state),
    showMarkers: mapState.showMarkers,
    globalOpacity: mapState.markersOpacity / 100,
  });
};

const mapDispatchToProps = (dispatch, { mapId }) => ({
});

export default connectToPresentStateWithRef(MapMarkersLayer, mapStateToProps, mapDispatchToProps);
