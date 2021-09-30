import { verify, openPaneEditor, closePaneEditor } from "../actions/ui";

import layoutModelSelector from "../selectors/panes/layout-model";
import { connectToPresentState } from "../utils/state";

import Component from "../components/PanesEditor.react";
import { removePane } from "../actions/panes";

const mapStateToProps = (state) => ({
  layoutModel: layoutModelSelector(state),
  paneId: state.config.editor?.paneId,
  mode: state.config.editor?.mode,
  isValidator: state.config.editor?.mode === "validation",
  isEditor: state.config.editor?.mode === "edit",
});

const mapDispatchToProps = (dispatch) => ({
  onClose: () => dispatch(closePaneEditor()),
  onContinue: () => dispatch(verify()),
  onEditPane: (paneId) => dispatch(openPaneEditor(paneId)),
  onRemovePane: (paneId) => dispatch(removePane(paneId)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
