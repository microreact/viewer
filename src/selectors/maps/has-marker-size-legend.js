import mapStateSelector from "./map-state";

const hasMarkerSizeLegendSelector = (state, mapId) => {
  const mapState = mapStateSelector(state, mapId);
  return mapState.showMarkers && mapState.scaleMarkers;
};

export default hasMarkerSizeLegendSelector;
