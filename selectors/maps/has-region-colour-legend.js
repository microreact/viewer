import hasGeojsonDataSelector from "./has-geojson-data";
import mapStateSelector from "./map-state";

const hasRegionColourLegendSelector = (state, mapId) => {
  const mapState = mapStateSelector(state, mapId);
  return mapState.showRegions && hasGeojsonDataSelector(state, mapId);
};

export default hasRegionColourLegendSelector;
