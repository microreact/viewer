import { connectToPresentState } from "../utils/state";
import { update } from "../actions/maps";
import Component from "../components/MapPaneEditor.react";
import dataColumnsSelector from "../selectors/datasets/data-columns";
import mapStateSelector from "../selectors/maps/map-state";

const mapStateToProps = (state, { mapId }) => ({
  dataFields: dataColumnsSelector(state),
  mapState: mapStateSelector(state, mapId),
});

const mapDispatchToProps = (dispatch, { mapId }) => ({
  onMapPropChange: (prop, value) => dispatch(update(mapId, prop, value)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
