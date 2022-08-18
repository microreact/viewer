import { FileDrop } from "react-file-drop";
import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import "../css/drop-files.css";

import { FileDescriptor, FileExtension, FileKind } from "../utils/prop-types";

import FilesQueue from "./FilesQueue.react";
import DropFilesGraphics from "./DropFilesGraphics.react";
import PlusFloatingActingButton from "./PlusFloatingActingButton.react";

class DropFiles extends React.PureComponent {

  constructor(props) {
    super(props);
    this._fileInput = React.createRef();
    this.frame = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    if (
      state.fileLoading &&
      props.fileLoading === false &&
      state.files.length
    ) {
      return {
        files: [],
        fileLoading: props.fileLoading,
      };
    }
    return {
      fileLoading: props.fileLoading,
    };
  }

  state = {
    dragOver: false,
    fileLoading: false,
    files: [],
    errorFiles: [],
    validFileExtensions: (
      this.props.validFileExtensions
        .filter((x) => (!this.props.fileKind || x.kind === this.props.fileKind))
        .map((x) => x.extension)
    ),
  };

  handleBrowseFiles = () => {
    this._fileInput.current.value = null;
    this._fileInput.current.click();
  };

  handleAddUrls = () => {
    this.setState({ showFilesDialog: true });
  };

  handleCloseUrls = () => {
    if (this.state.showFilesDialog) {
      this.setState({ showFilesDialog: false });
    }
    if (this.props.pendingFiles?.length) {
      this.props.onPendingFileChange([]);
    }
  };

  _onChange = ({ target: { files } }) => {
    if (!files) {
      return;
    }

    this._handleFileInput(files);
  };

  _isValidFileType = (filename) => {
    const fileExt = this.state.validFileExtensions.find((ext) => filename.endsWith(ext));
    return Boolean(fileExt);
  };

  _handleFileInput = (files, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    const nextState = { files: [], errorFiles: [], dragOver: false };
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file && this._isValidFileType(file.name)) {
        nextState.files.push(file);
      }
      else {
        nextState.files.push(file);
        nextState.errorFiles.push(file.name);
      }
    }

    this.setState(
      nextState,
      () => {
        if (nextState.files.length) {
          this.props.onAddFiles(nextState.files, this.props.paneId);
        }
      }
    );
  };

  renderMessage() {
    const { errorFiles, files } = this.state;
    if (errorFiles.length) {
      return (
        <div>
          {`File ${errorFiles.join(", ")} is not supported.`}
        </div>
      );
    } else if (this.props.fileLoading && files.length) {
      return (
        <div className="file-uploader__message">
          <div className="loading-action">Uploading</div>
          <div>
            {files.map((f, i) => (
              <div key={i}>{f.name}</div>
            ))}
            ...
          </div>
          <div className="loading-spinner">
            Loading...
          </div>
        </div>
      );
    }

    return null;
  }

  render() {
    const { props } = this;

    const hasFiles = props.pendingFiles?.length > 0;

    return (
      <FileDrop
        // frame={this.frame.current || document}
        className={
          classnames(
            "mr-drop-files",
            { "is-drag-over": this.state.dragOver },
          )
        }
        targetAlwaysVisible
        onDragOver={() => this.setState({ dragOver: true })}
        onDragLeave={() => this.setState({ dragOver: false })}
        onDrop={this._handleFileInput}
      >
        {
          (this.props.children)
            ?
            this.props.children
            :
            (
              <React.Fragment>
                <div
                  className="mr-drop-box"
                >
                  <DropFilesGraphics
                    fileKind={props.fileKind}
                    onAddUrls={this.handleAddUrls}
                    onBrowseFiles={this.handleBrowseFiles}
                    validFileExtensions={this.state.validFileExtensions}
                  />
                </div>
                <PlusFloatingActingButton
                  onAddUrls={this.handleAddUrls}
                  onBrowseFiles={this.handleBrowseFiles}
                />
              </React.Fragment>
            )
        }

        <input
          multiple
          onChange={this._onChange}
          ref={this._fileInput}
          style={{ display: "none" }}
          type="file"
        />

        {
          (this.state.showFilesDialog || hasFiles) && (
            <FilesQueue
              onBrowseFiles={this.handleBrowseFiles}
              onClose={this.handleCloseUrls}
              onCommitFiles={this.props.onCommitFiles}
              onPendingFileChange={this.props.onPendingFileChange}
              pendingFiles={props.pendingFiles}
            />
          )
        }
      </FileDrop>
    );
  }

}

DropFiles.displayName = "DropFiles";

DropFiles.propTypes = {
  children: PropTypes.node,
  fileKind: FileKind,
  fileLoading: PropTypes.bool,
  onAddFiles: PropTypes.func.isRequired,
  onCommitFiles: PropTypes.func.isRequired,
  onPendingFileChange: PropTypes.func.isRequired,
  paneId: PropTypes.string,
  pendingFiles: PropTypes.arrayOf(FileDescriptor),
  plusButton: PropTypes.bool,
  validFileExtensions: PropTypes.arrayOf(FileExtension.isRequired).isRequired,
};

DropFiles.defaultProps = {
  plusButton: true,
};

export default DropFiles;
