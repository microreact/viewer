/* eslint-disable consistent-return */

import React from "react";
import PropTypes from "prop-types";
import ControlCameraRoundedIcon from "@material-ui/icons/ControlCameraRounded";
import { TreeTypes } from "@phylocanvas/phylocanvas.gl";

import ZoomControls from "./ZoomControls.react";
import { TreeType } from "../utils/prop-types";

const modes = [
  "scale",
  "branch",
  "step",
];

export default class extends React.PureComponent {

  static displayName = "TreeZoomControls"

  static propTypes = {
    className: PropTypes.string,
    onBranchZoomIn: PropTypes.func.isRequired,
    onBranchZoomOut: PropTypes.func.isRequired,
    onStepZoomIn: PropTypes.func.isRequired,
    onStepZoomOut: PropTypes.func.isRequired,
    onZoomIn: PropTypes.func.isRequired,
    onZoomOut: PropTypes.func.isRequired,
    treeType: TreeType.isRequired,
  }

  state = {
    mode: 0,
  }

  getMode = () => {
    switch (this.props.treeType) {
      case TreeTypes.Rectangular:
      case TreeTypes.Diagonal:
      case TreeTypes.Hierarchical:
        return modes[this.state.mode];

      case TreeTypes.Circular:
      case TreeTypes.Radial:
        return modes[(this.state.mode === 2) ? 0 : this.state.mode];
    }
  }

  getIconClass = () => {
    const mode = this.getMode();
    switch (mode) {
      case "scale":
        return null;

      case "branch":
        return (this.props.treeType === TreeTypes.Hierarchical) ? "mr-vertical" : "mr-horizontal";

      case "step":
        return (this.props.treeType === TreeTypes.Hierarchical) ? "mr-horizontal" : "mr-vertical";
    }
  }

  toggleMode = () => {
    const mode = this.getMode();
    switch (mode) {
      case "scale":
        return this.setState({ mode: 1 });

      case "branch":
        return this.setState({ mode: 2 });

      case "step":
        return this.setState({ mode: 0 });
    }
  }

  handleZoomIn = () => {
    const mode = this.getMode();
    switch (mode) {
      case "scale":
        return this.props.onZoomIn();
      case "branch":
        return this.props.onBranchZoomIn();
      case "step":
        return this.props.onStepZoomIn();
    }
  }

  handleZoomOut = () => {
    const mode = this.getMode();
    switch (mode) {
      case "scale":
        return this.props.onZoomOut();
      case "branch":
        return this.props.onBranchZoomOut();
      case "step":
        return this.props.onStepZoomOut();
    }
  }

  render() {
    return (
      <ZoomControls
        className={this.props.className}
        onZoomIn={this.handleZoomIn}
        onZoomOut={this.handleZoomOut}
      >
        <div
          className="mr-button"
          title="Toogle zoom mode"
          onClick={this.toggleMode}
        >
          <div className={this.getIconClass()}>
            <ControlCameraRoundedIcon />
          </div>
        </div>
      </ZoomControls>
    );
  }

}
