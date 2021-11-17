const minScaledMarkerNodeSelector = (state, mapId) => {
  return Math.max(
    1,
    state.maps[mapId].nodeSize ?? 14,
  );
};

export default minScaledMarkerNodeSelector;
