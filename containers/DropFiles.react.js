import { emptyArray } from "../constants";

import { addFiles } from "../actions/ui";

import configSelector from "../selectors/config";

import { connectToPresentState } from "../utils/state";

import Component from "../components/DropFiles.react";

function mapStateToProps(state) {
  const defaults = configSelector(state);
  return {
    validFileExtensions: defaults.validFileExtensions || emptyArray,
    isLoading: state.config.loading,
    pendingFiles: state.config.pending || emptyArray,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onFileUpload: (files, paneId) => dispatch(addFiles(files, paneId)),
  };
}

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
