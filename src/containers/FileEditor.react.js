import { addOrUpdateFile } from "../actions/ui";

import fileDescriptorSelector from "../selectors/files/file-descriptor";

import { connectToPresentState } from "../utils/state";

import Component from "../components/FileEditor.react";

const mapStateToProps = (state, { fileId }) => ({
  file: fileDescriptorSelector(state, fileId),
});

const mapDispatchToProps = (dispatch, { fileId, paneId }) => ({
  onFileChange: (file) => dispatch(addOrUpdateFile(fileId, paneId, file)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
