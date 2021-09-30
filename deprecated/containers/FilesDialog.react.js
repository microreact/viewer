import { removeFile } from "../actions/files";
import { addUrls } from "../actions/ui";

import FilesDialog from "../components/FilesDialog.react";
import { connectToPresentStateWithRef } from "../utils/state";

const mapStateToProps = (state) => {
  return {
    files: state.files,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onAddUrls: (paneId) => dispatch(addUrls(paneId)),
  onRemoveFile: (fileId) => dispatch(removeFile(fileId)),
});

export default connectToPresentStateWithRef(FilesDialog, mapStateToProps, mapDispatchToProps);
