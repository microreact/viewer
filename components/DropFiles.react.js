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

  handleAddFiles = () => {
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
          this.props.onFileUpload(nextState.files, this.props.paneId);
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
        {/*
        {
          (this.props.content) && (
            <div onClick={this.handleAddFiles}>
              { this.props.content }
            </div>
          )
        }
        */}

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
                    onAddFiles={this.handleAddFiles}
                    onAddUrls={this.handleAddUrls}
                    validFileExtensions={this.state.validFileExtensions}
                  />
                </div>
                <PlusFloatingActingButton
                  onAddUrls={this.handleAddUrls}
                  onLoadFiles={this.handleAddFiles}
                />
              </React.Fragment>
            )
        }
        {/*
        <React.Fragment>
          Drag file here or&nbsp;
          <span onClick={this.handleAddFiles}>
            browse your files
          </span>
          <div>
            { this.renderMessage() }
          </div>
        </React.Fragment>
        */}

        <input
          multiple
          onChange={this._onChange}
          ref={this._fileInput}
          style={{ display: "none" }}
          type="file"
        />

        {/* {
          props.plusButton && (
            <PlusFloatingActingButton
              onAddUrls={this.handleAddUrls}
              onLoadFiles={this.handleAddFiles}
            />
            // <Fab
            //   aria-label="add"
            //   color="primary"
            //   onClick={() => this.handleAddFiles()}
            //   className="mr fab add files button"
            // >
            //   <AddIcon />
            // </Fab>
          )
        } */}

        {
          (this.state.showFilesDialog || hasFiles) && (
            <FilesQueue
              onLoadFiles={this.handleAddFiles}
              pendingFiles={props.pendingFiles}
              onClose={this.handleCloseUrls}
              onAddFiles={this.props.onFileUpload}
              onPendingFileChange={this.props.onPendingFileChange}
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
  onFileUpload: PropTypes.func.isRequired,
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
