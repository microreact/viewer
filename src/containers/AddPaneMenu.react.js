import { openPaneEditor } from "../actions/ui";

import { connectToPresentState } from "../utils/state";

import Component from "../components/AddPaneMenu.react";

const mapDispatchToProps = (dispatch) => ({
  onEditPane: () => dispatch(openPaneEditor()),
});

export default connectToPresentState(Component, null, mapDispatchToProps);
