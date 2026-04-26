import mapStateSelector from "./map-state.js";

function mapProjectionTypeSelector(state, mapId) {
  const projection = mapStateSelector(state, mapId)?.projection || "mercator";
  return projection;
}

export default mapProjectionTypeSelector;
