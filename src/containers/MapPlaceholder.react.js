import { openPaneEditor } from "../actions/ui";
import { connectToPresentState } from "../utils/state";

import Component from "../components/PanePlaceholder.react";
import MapPane from "./MapPane.react";
import isValidMapSelector from "../selectors/maps/is-valid-map";
import geodataFileSelector from "../selectors/maps/geodata-file";

const mapStateToProps = (state, { mapId }) => {
  return {
    componentName: "Map",
    file: geodataFileSelector(state, mapId),
    isEmpty: !isValidMapSelector(state, mapId),
    PaneComponent: MapPane,
  };
};

const mapDispatchToProps = (dispatch, { mapId }) => ({
  onEditPane: () => dispatch(openPaneEditor(mapId)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
