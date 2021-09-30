import minScaledMarkerNodeSelector from "./min-scaled-marker-size";

const maxScaledMarkerRadiusSelector = (state, mapId) => {
  return (
    state.maps[mapId].maxMarkerSize
    ??
    (
      (state.maps[mapId].nodeSize * 0.5) + minScaledMarkerNodeSelector(state, mapId)
    )
  );
};

export default maxScaledMarkerRadiusSelector;
