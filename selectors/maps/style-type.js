import configSelector from "../config";

function mapStyleTypeSelector(state, mapId) {
  return state.maps[mapId].style || configSelector(state)?.maps?.style || "light";
}

export default mapStyleTypeSelector;
