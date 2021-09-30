import { setFileContent } from "../actions/files";

import { connectToPresentState } from "../utils/state";

import Component from "../components/FileLoader.react";

function mapDispatchToProps(dispatch) {
  return {
    onFileLoaded: (file) => dispatch(setFileContent(file)),
  };
}

export default connectToPresentState(Component, null, mapDispatchToProps);
