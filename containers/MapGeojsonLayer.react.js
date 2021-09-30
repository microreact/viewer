import { connect } from "react-redux";

import MapGeojsonLayer from "../components/MapGeojsonLayer.react";

import geojsonLayerDataSelector from "../selectors/maps/geojson-layer-data";
import geojsonLayerStyleSelector from "../selectors/maps/geojson-layer-style";

const mapStateToProps = (state, { mapId }) => {
  const mapState = state.maps[mapId];

  if (mapState.geodata) {
    return {
      layerData: geojsonLayerDataSelector(state, mapId),
      layerStyle: geojsonLayerStyleSelector(state, mapId),
      showRegions: mapState.showRegions,
    };
  }
  else {
    return {
      showRegions: false,
    };
  }
};

const mapDispatchToProps = (dispatch, { mapId }) => ({
});

export default connect((state, props) => mapStateToProps(state.present, props), mapDispatchToProps)(MapGeojsonLayer);
