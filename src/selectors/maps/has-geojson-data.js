import geojsonLayerDataSelector from "./geojson-layer-data";

const hasGeojsonDataSelector = (
  (state, mapId) => !!geojsonLayerDataSelector(state, mapId)
);

export default hasGeojsonDataSelector;
