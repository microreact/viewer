/* eslint-disable @next/next/no-img-element */
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";
import React from "react";
import { GlobalHotKeys } from "react-hotkeys";
import clsx from "clsx";

// import "../styles/viewer.css";

import { keyMap } from "../utils/shortcuts";
import { nextFrame } from "../utils/browser";
import { clearCache } from "../utils/state";
import { emptyObject } from "../constants";

import BusyIndicator from "../containers/BusyIndicator.react";
import DropFiles from "../containers/DropFiles.react";
import FileLoader from "../containers/FileLoader.react";
import HeaderBar from "../containers/HeaderBar.react";
import LayoutManager from "../containers/LayoutManager.react";
import PanesEditor from "../containers/PanesEditor.react";

import { invertedSpinnerPng } from "../utils/inline";

class Viewer extends React.PureComponent {

  handlers = {
    undo: () => this.props.onUndo(),
    redo: () => this.props.onRedo(),
  };

  // eslint-disable-next-line class-methods-use-this
  componentWillUnmount() {
    nextFrame(
      () => {
        clearCache();
        // clearPhylocanvasCache();
      },
      1000,
    );
  }

  renderDropFiles() {
    console.log({ props: this.props });
    if (this.props.isDropFilesDisabled) {
      if (this.props.isEmpty) {
        return null;
      }
      return this.renderViewerContent();
    }

    if (this.props.isEmpty) {
      return (<DropFiles key="empty" />);
    }

    return (
      <DropFiles key="non-empty" >
        {this.renderViewerContent()}
      </DropFiles>
    );
  }

  renderViewerContent() {
    const { props } = this;
    return (
      <React.Fragment>
        <GlobalHotKeys
          keyMap={keyMap}
          handlers={this.handlers}
        />

        <HeaderBar
          appendNavButtons={props.slots.appendNavButtons}
          drawerButton={props.slots.drawerButton}
          prependNavButtons={props.slots.prependNavButtons}
        />

        <Paper
          component="main"
          className="mr-viewer-main"
          elevation={0}
          square
        >
          <LayoutManager
            componentsDictionary={props.components}
          />
        </Paper>
        {props.children}

        <img
          alt="loading spinner"
          className="mr-spinner"
          src={invertedSpinnerPng}
        />
      </React.Fragment>
    );
  }

  renderDataFileLoaders() {
    const { props } = this;

    // Makes sure that all dataset files have been loaded (i.e. has a _content property)
    for (const dataset of Object.values(props.datasets || emptyObject)) {
      const datasetFileDescriptor = props.files[dataset.file];
      if (dataset.file && !datasetFileDescriptor._content) {
        return (
          <FileLoader
            key={datasetFileDescriptor.id}
            file={datasetFileDescriptor}
          />
        );
      }
    }

    return (
      <React.Fragment>
        {this.renderDropFiles()}

        <BusyIndicator />

        <PanesEditor />

      </React.Fragment>
    );
  }

  render() {
    const { props } = this;

    return (
      <div
        className={
          clsx(
            props.className,
            "microreact-viewer",
          )
        }
        id="microreact-viewer"
      >
        {this.renderDataFileLoaders()}
      </div>
    );
  }

}

Viewer.displayName = "Viewer";

Viewer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  components: PropTypes.object,
  datasets: PropTypes.object,
  files: PropTypes.object,
  isDropFilesDisabled: PropTypes.bool,
  isEmpty: PropTypes.bool.isRequired,
  onRedo: PropTypes.func,
  onUndo: PropTypes.func,
  slots: PropTypes.shape({
    appendNavButtons: PropTypes.node,
    drawerButton: PropTypes.node,
    prependNavButtons: PropTypes.node,
  }),
};

Viewer.defaultProps = {
  components: emptyObject,
  slots: emptyObject,
};

export default Viewer;
