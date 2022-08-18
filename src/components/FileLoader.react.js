import PropTypes from "prop-types";
import React from "react";

import { FileDescriptor } from "../utils/prop-types";
import { fileSize, loadFile } from "../utils/files";

import UiSpinningLoader from "./UiSpinningLoader.react";

class FileLoader extends React.PureComponent {

  state = {
    bytesUsed: 0,
  }

  componentDidMount() {
    const { props } = this;
    loadFile(
      props.file,
      (bytesUsed) => this.setState({ bytesUsed }),
    )
      .then(
        (loadedFile) => this.props.onFileLoaded(loadedFile)
      )
      .catch(
        (error) => this.setState({ error })
      );
  }

  render() {
    const { props, state } = this;

    if (state.error) {
      return (
        <div
          className="mr-pane-placeholder"
        >
          { state.error.message }
        </div>
      );
    }

    return (
      <UiSpinningLoader>
        Loading { props.file.name || "file" }
        &nbsp;
        {
          (state.bytesUsed > 0)
            &&
            (<span className="mr-file-loader">({ fileSize(state.bytesUsed) })</span>)
        }
        …
      </UiSpinningLoader>
    );

  }

}

FileLoader.displayName = "FileLoader";

FileLoader.propTypes = {
  file: FileDescriptor.isRequired,
  onFileLoaded: PropTypes.func.isRequired,
};

export default FileLoader;
