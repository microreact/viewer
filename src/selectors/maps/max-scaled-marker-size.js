import minScaledMarkerNodeSelector from "./min-scaled-marker-size";

const maxScaledMarkerRadiusSelector = (state, mapId) => {
  return (
    state.maps[mapId].maxMarkerSize
    ??
    (
      (state.maps[mapId].nodeSize * 2)
    )
  );
};

export default maxScaledMarkerRadiusSelector;
