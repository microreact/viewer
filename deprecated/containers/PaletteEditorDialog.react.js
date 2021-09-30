import { connectToPresentState } from "../utils/state";

import Component from "../components/PaletteEditorDialog.react";

function mapStateToProps(state, { field }) {
  return {
    isOpen: !!state.ui.paletteEditor,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
