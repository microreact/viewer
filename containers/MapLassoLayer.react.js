import { setFilter } from "../actions/maps";
import { connectToPresentState } from "../utils/state";

import MapLassoLayer from "../components/MapLassoLayer.react";

const mapStateToProps = (state, { mapId }) => {
  const mapState = state.maps[mapId];
  return {
    isActive: mapState.lasso,
    path: mapState.path,
  };
};

const mapDispatchToProps = (dispatch, { mapId }) => ({
  onPathChange: (path) => dispatch(setFilter(mapId, path)),
});

export default connectToPresentState(MapLassoLayer, mapStateToProps, mapDispatchToProps);
