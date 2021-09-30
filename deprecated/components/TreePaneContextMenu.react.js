import React from "react";
import PropTypes from "prop-types";
import phylocanvas from "@phylocanvas/phylocanvas.gl";
// import namedSelectorsPlugin from "@phylocanvas/phylocanvas.gl/dev/plugins/named-selectors";
import Menu from '@material-ui/core/Menu';

import phylocanvasPlugin from "../plugins/phylocanvas";
import { downloadDataUrl } from "../utils/downloads";
import { GeometricPoint, TreeType } from "../utils/prop-types";

import "../css/tree.css";
import TreeControls from "../containers/TreeControls.react";
import ZoomControls from "./TreeZoomControls.react";
import TreeContextMenu from "./TreeContextMenu.react";
import { nextTick } from "../utils/browser";
import { emptyObject } from "../constants";

// import { triggerEvent } from "../utils/browser";
// import UiContextMenu from "./UiContextMenu.react";

class TreePaneContextMenu extends React.PureComponent {

  state = {}

  handleContextMenu = (event) => {
    event.preventDefault();
    this.setState({
      menuPosition: {
        left: event.clientX,
        top: event.clientY,
      },
    });
  };

  handleMenuClose = () => {
    this.setState({ menuPosition: null });
  };

  render() {
    const size = this.props.phylocanvasProps.size;
    return (
      <div
        className="mr-tree-context-menu"
        onContextMenu={this.handleContextMenu}
      >
        <Menu
          keepMounted
          open={!!this.state.menuPosition}
          onClose={this.handleMenuClose}
          anchorReference="anchorPosition"
          anchorPosition={this.state.menuPosition ?? undefined}
        >
          <div
            onClick={this.handleMenuClose}
          >
              <TreeContextMenu
                  onAlignLabelsChange={this.props.onAlignLabelsChange}
                  onShowLeafLabelsChange={this.props.onShowLeafLabelsChange}
                  phylocanvasProps={this.state.menuPosition ? this.props.phylocanvasProps : emptyObject}
                  tree={this.tree}
                  node={this.state.contextMenuNode}
                />
          </div>
        </Menu>
      </div>
    );
  }

}

export default TreePaneContextMenu;
