import { setFilter } from "../actions/maps";

import MapLassoLayer from "../components/MapLassoLayer.react";
import { connectToPresentStateWithRef } from "../utils/state";

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

export default connectToPresentStateWithRef(MapLassoLayer, mapStateToProps, mapDispatchToProps);
