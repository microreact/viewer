import React from "react";
import PropTypes from "prop-types";
import Menu from "@mui/material/Menu";

import phylocanvasPlugin from "../plugins/phylocanvas";
import { downloadDataUrl } from "../utils/downloads";
import { GeometricPoint, TreeType } from "../utils/prop-types";

// import "../styles/tree.css";
import TreeControls from "../containers/TreeControls.react";
import ZoomControls from "./TreeZoomControls.react";
import TreeContextMenu from "./TreeContextMenu.react";
import { nextTick } from "../utils/browser";
import { subscribe } from "../utils/events";

// import { triggerEvent } from "../utils/browser";
// import UiContextMenu from "./UiContextMenu.react";

class TreePane extends React.PureComponent {

  state = {};

  componentDidMount() {
    const PhylocanvasGL = phylocanvasPlugin(this);
    this.tree = new PhylocanvasGL(
      this.canvasRef.current,
      this.props.phylocanvasProps,
    );

    this.tree.renderLasso();

    this.tree.setProps = this.props.onPhylocanvasPropsChange;

    if (this.props.phylocanvasProps.scale && !this.props.phylocanvasProps.transform) {
      this.tree.view.style.visibility = "hidden";
      nextTick(() => {
        console.debug("Convert state");
        this.tree.convertState();
        this.tree.view.style.visibility = "";
      });
    }

    this.beforeScreenshotUnsubscribe = subscribe(
      "before-screenshot",
      () => {
        this.tree.deck.setProps({ glOptions: { preserveDrawingBuffer: true } });
        this.tree.deck.redraw(true);
      },
    );

    this.afterScreenshotUnsubscribe = subscribe(
      "after-screenshot",
      () => {
        this.tree.deck.setProps({ glOptions: { preserveDrawingBuffer: undefined } });
        this.tree.deck.redraw(true);
      },
    );

    // window[`mr-${this.props.treeId}`] = () => this.tree;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isLassoActive !== this.props.isLassoActive) {
      this.tree.lasso.setActive(this.props.isLassoActive);
    }

    if (prevProps.lassoPath !== this.props.lassoPath) {
      this.tree.lasso.setPath(this.props.lassoPath);
    }

    if (prevProps.phylocanvasProps !== this.props.phylocanvasProps) {
      this.tree.props = this.props.phylocanvasProps;
    }

    this.tree.render();
  }

  componentWillUnmount() {
    if (this.tree) {
      if (this.tree.lasso) {
        this.tree.lasso.destroy();
      }
      this.tree.destroy();

      this.tree = undefined;
      delete this.tree;
    }

    this.beforeScreenshotUnsubscribe?.();
    this.afterScreenshotUnsubscribe?.();
  }

  canvasRef = React.createRef();

  lassoRef = React.createRef()

  // scalebarRef = React.createRef()

  // framerateRef = React.createRef()

  handleContextMenu = (event) => {
    event.preventDefault();
    // this.setState({
    //   contextMenuPosition: {
    //     left: event.clientX,
    //     top: event.clientY,
    //   },
    // });
  };

  handleMenuClose = () => {
    this.setState({ contextMenuPosition: null });
  };

  handleTreeTypeChange = (type) => {
    this.tree.setTreeType(type);
  }

  handleDownloadNewick = () => {
    downloadDataUrl(
      this.tree.exportNewick(),
      "tree.nwk",
      "plain/text",
    );
  }

  handleDownloadPNG = () => {
    downloadDataUrl(
      this.tree.exportPNG(),
      "tree.png",
      "image/png",
    );
    // const props = this.tree.props;
    // this.tree.props = { ...props, scalebar: true };
    // this.tree.render();
    // nextTick(
    //   () => {
    //     downloadDataUrl(
    //       this.tree.exportPNG(),
    //       "tree.png",
    //       "image/png",
    //     );
    //     this.tree.props = props;
    //     this.tree.render();
    //   }
    // );
  }

  handleDownloadSVG = () => {
    downloadDataUrl(
      this.tree.exportSVG(),
      "tree.svg",
      "image/svg+xml",
    );
  }

  render() {
    const size = this.props.phylocanvasProps.size;
    return (
      <div
        className="mr-tree"
        ref={this.canvasRef}
        onContextMenu={this.handleContextMenu}
      >
        <Menu
          open={!!this.state.contextMenuPosition}
          onClose={this.handleMenuClose}
          anchorReference="anchorPosition"
          anchorPosition={this.state.contextMenuPosition ?? undefined}
        >
          <div
            onClick={this.handleMenuClose}
          >
              <TreeContextMenu
                onAlignLabelsChange={this.props.onAlignLabelsChange}
                onShowLeafLabelsChange={this.props.onShowLeafLabelsChange}
                phylocanvasProps={this.props.phylocanvasProps}
                tree={this.tree}
                menuPosition={this.state.contextMenuPosition}
                node={this.state.contextMenuNode}
              />
          </div>
        </Menu>
        <div
        >
          <canvas
            className="mr-lasso-canvas"
            height={size.height}
            width={size.width}
            ref={this.lassoRef}
          />
        </div>
        {/* <ContextMenu
          id={this.props.treeId}
          className="mr-ui-context-menu"
        >
          
        </ContextMenu> */}
        <TreeControls
          // className={this.props.controls ? "visible" : ""}
          onTypeChange={this.handleTreeTypeChange}
          onDownloadNewick={this.handleDownloadNewick}
          onDownloadPNG={this.handleDownloadPNG}
          onDownloadSVG={this.handleDownloadSVG}
          treeId={this.props.treeId}
        />
        <ZoomControls
          className={this.props.controls ? "visible" : ""}
          onBranchZoomIn={() => this.tree.setBranchZoom(this.tree.getBranchZoom() + 0.1)}
          onBranchZoomOut={() => this.tree.setBranchZoom(this.tree.getBranchZoom() - 0.1)}
          onStepZoomIn={() => this.tree.setStepZoom(this.tree.getStepZoom() + 0.1)}
          onStepZoomOut={() => this.tree.setStepZoom(this.tree.getStepZoom() - 0.1)}
          onZoomIn={() => this.tree.zoomIn()}
          onZoomOut={() => this.tree.zoomOut()}
          treeType={this.props.treeType}
        />

        {/*
        <div
          className="mr-tree-scalebar"
          ref={this.scalebarRef}
        >
        </div>
        */}

        {/* <div
          className="mr-tree-framerate"
          ref={this.framerateRef}
        >
        </div> */}
      </div>
    );
  }

}

TreePane.displayName = "TreePane";

TreePane.propTypes = {
  controls: PropTypes.bool.isRequired,
  // height: PropTypes.number.isRequired,
  isLassoActive: PropTypes.bool.isRequired,
  lassoPath: PropTypes.arrayOf(GeometricPoint),
  onAddHistoryEntry: PropTypes.func.isRequired,
  onAlignLabelsChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  // onPhylocanvasInitialise: PropTypes.func.isRequired,
  onPhylocanvasPropsChange: PropTypes.func.isRequired,
  onSelectRows: PropTypes.func.isRequired,
  onShowLeafLabelsChange: PropTypes.func.isRequired,
  phylocanvasProps: PropTypes.object,
  selectedIds: PropTypes.array.isRequired,
  treeId: PropTypes.string.isRequired,
  treeType: TreeType.isRequired,
  // width: PropTypes.number.isRequired,
};

export default TreePane;
