import { emptyArray } from "../constants";

import { addFiles, setPendingFiles } from "../actions/ui";

import configSelector from "../selectors/config";

import { connectToPresentState } from "../utils/state";

import Component from "../components/DropFiles.react";

function mapStateToProps(state) {
  const defaults = configSelector(state);
  return {
    validFileExtensions: defaults.validFileExtensions || emptyArray,
    pendingFiles: state.config.pendingFiles || emptyArray,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onFileUpload: (files, paneId) => dispatch(addFiles(files, paneId)),
    onPendingFileChange: (files) => dispatch(setPendingFiles(files)),
  };
}

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
