const minScaledMarkerNodeSelector = (state, mapId) => {
  return Math.max(
    1,
    state.maps[mapId].minMarkerSize ?? state.maps[mapId].minNodeRadius ?? 7,
  );
};

export default minScaledMarkerNodeSelector;
