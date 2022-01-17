import { setSidePane } from "../actions/panes";

import { connectToPresentState } from "../utils/state";

import Component from "../components/ViewsPane.react";
import { createNewView, deleteView, renameView, setViewsList, resaveView, setDefaultView } from "../actions/views";
import { loadView } from "../actions/ui";
import configSelector from "../selectors/config";

function mapStateToProps(state) {
  return {
    entries: state.views,
    isReadOnly: configSelector(state).readOnly,
    key: state.views.length,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClose: () => dispatch(setSidePane()),
    onCreateView: () => dispatch(createNewView()),
    onDeleteView: (view) => dispatch(deleteView(view)),
    onEntriesListChange: (viewsList) => dispatch(setViewsList(viewsList)),
    onLoadView: (view) => dispatch(loadView(view)),
    onRenameView: (view, name) => dispatch(renameView(view, name)),
    onResaveView: (view) => dispatch(resaveView(view)),
    onSetDefaultView: (view) => dispatch(setDefaultView(view)),
  };
}

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
