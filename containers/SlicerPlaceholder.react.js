import { openPaneEditor } from "../actions/ui";
import { connectToPresentState } from "../utils/state";

import Component from "../components/PanePlaceholder.react";
import SlicerPane from "./SlicerPane.react";
import isValidSlicerSelector from "../selectors/slicers/is-valid-slicer";

const mapStateToProps = (state, { slicerId }) => {
  return {
    componentName: "Slicer",
    isEmpty: !isValidSlicerSelector(state, slicerId),
    PaneComponent: SlicerPane,
    paneId: slicerId,
    emptyLabel: "Choose column",
  };
};

const mapDispatchToProps = (dispatch, { slicerId }) => {
  return {
    onEditPane: () => dispatch(openPaneEditor(slicerId)),
  };
};

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
