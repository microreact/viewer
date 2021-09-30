import { connectToPresentStateWithRef } from "../utils/state";

import Component from "../components/DownloadFilesMenuContent.react";

function mapStateToProps(state) {
  return {
    files: state.files,
  };
}

export default connectToPresentStateWithRef(Component, mapStateToProps);
