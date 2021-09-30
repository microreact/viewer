import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import React from "react";
import { GlobalHotKeys } from "react-hotkeys";

import "../css/viewer.css";

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

class Viewer extends React.PureComponent {

  handlers = {
    undo: () => this.props.onUndo(),
    redo: () => this.props.onRedo(),
  }

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

  renderViewerContent() {
    const { props } = this;

    if (props.isEmpty) {
      return (<DropFiles key="empty" />);
    }

    return (
      <DropFiles key="non-empty" >
        <GlobalHotKeys
          keyMap={keyMap}
          handlers={this.handlers}
        />

        <HeaderBar
          appendNavButtons={props.components.appendNavButtons}
          drawerButton={props.components.drawerButton}
          prependNavButtons={props.components.prependNavButtons}
        />

        <Paper
          component="main"
          className="mr-viewer-main"
          elevation={0}
          square
        >
          <LayoutManager />
        </Paper>
        { props.children }

        <img
          className="mr-spinner"
          src="/images/inverted-spinner.png"
        />
      </DropFiles>
    );
  }

  renderDataFileLoaders() {
    const { props } = this;

    // Makes sure that all dataset files have been loaded (i.e. has a _content property)
    for (const dataset of Object.values(props.datasets || emptyObject)) {
      const datasetFileDescriptor = props.files[dataset.file];
      if (!datasetFileDescriptor._content) {
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
        { this.renderViewerContent() }

        <BusyIndicator />

        <PanesEditor />

      </React.Fragment>
    );
  }

  render() {
    return (
      <div
        className="microreact-viewer"
        id="microreact-viewer"
      >
        { this.renderDataFileLoaders() }
      </div>
    );
  }

}

Viewer.displayName = "Viewer";

Viewer.propTypes = {
  children: PropTypes.node,
  components: PropTypes.object,
  datasets: PropTypes.object,
  files: PropTypes.object,
  isEmpty: PropTypes.bool.isRequired,
  onRedo: PropTypes.func,
  onUndo: PropTypes.func,
};

Viewer.defaultProps = {
  components: emptyObject,
};

export default Viewer;
