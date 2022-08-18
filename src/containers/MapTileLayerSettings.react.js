import { connect } from "react-redux";

import { setMapProp, setMapProps } from "../actions/map";

import MapTileLayerSettings from "../components/MapTileLayerSettings.react";

const mapStateToProps = (state) => ({
  isOpen: state.map.tileLayerDialog,
  tileLayerUrl: state.map.tileLayerUrl,
  tileLayerOpts: state.map.tileLayerOpts,
  tileLayerError: state.map.tileLayerError,
});

const mapDispatchToProps = (dispatch) => ({
  onClose: () => dispatch(setMapProp("tileLayerDialog", false)),
  onTileLayerChange: (value) => dispatch(setMapProps(value)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapTileLayerSettings);
