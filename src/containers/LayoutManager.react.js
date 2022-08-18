import { setLayoutModel, addView } from "../actions/panes";
import { openPaneEditor } from "../actions/ui";

import layoutModelSelector from "../selectors/panes/layout-model";

import Component from "../components/LayoutManager.react";
import { connectToPresentState } from "../utils/state";

const mapStateToProps = (state) => ({
  layoutModel: layoutModelSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  onLayoutModelChange: (model) => dispatch(setLayoutModel(model)),
  onAddView: (componentName) => dispatch(addView(componentName)),
  onEditPane: (paneId) => dispatch(openPaneEditor(paneId)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
