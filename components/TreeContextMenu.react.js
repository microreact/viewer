/* eslint-disable react/jsx-no-target-blank */
import PropTypes from "prop-types";
import React from "react";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import ZoomOutMapRoundedIcon from "@mui/icons-material/ZoomOutMapRounded";
import ZoomOutRoundedIcon from "@mui/icons-material/ZoomOutRounded";

import { downloadDataUrl } from "../utils/downloads";

// import "../styles/ui-context-menu.css";

const Link = (
  <div className="mr-ui-context-menu-item single-action">
    <a
      href="http://phylocanvas.gl/"
      style={{ height: "100%", textAlign: "center", display: "block" }}
      target="_blank"
      title="About PhyloCanvas"
    >
      <img
        src="https://microreact.org/images/logos/phylocanvas.svg"
        style={{ height: "100%" }}
      />
    </a>
  </div>
);

const TreeContextMenu = React.memo((props) => {
  if (!props.tree) {
    return null;
  }

  const { tree, node } = props;

  if (node && !node.isLeaf) {
    return (
      <React.Fragment>
        <div className="mr-ui-context-menu-item single-action">
          <button
            onClick={() => tree.setRoot(node)}
          >
            View Subtree
          </button>
        </div>

        <div className="mr-ui-context-menu-item single-action">
          <button
            onClick={() => tree.collapseNode(node, { refit: true })}
          >
            { (tree.props.collapsedIds && tree.props.collapsedIds.includes(node.id)) ? "Expand" : "Collapse" } Subtree
          </button>
        </div>

        <div className="mr-ui-context-menu-item single-action">
          <button
            onClick={() => tree.rotateNode(node, { refit: false })}
          >
            { (tree.props.rotatedIds && tree.props.rotatedIds.includes(node.id)) ? "Derotate" : "Rotate" } Subtree
          </button>
        </div>

        <div className="mr-ui-context-menu-divider" />

        <div className="mr-ui-context-menu-item single-action">
          <button
            onClick={() => tree.rerootNode(node)}
          >
            Set as Root (Re-root)
          </button>
        </div>

        <div className="mr-ui-context-menu-divider" />

        <div className="mr-ui-context-menu-item single-action">
          <button
            onClick={
              () => downloadDataUrl(
                tree.getLeafNodes(node).map((x) => x.label).join("\n"),
                "leaf-labels.txt",
                "plain/text"
              )
            }
          >
            Export Leaf Labels
          </button>
        </div>
        <div className="mr-ui-context-menu-item single-action">
          <button
            onClick={
              () => downloadDataUrl(
                tree.exportNewick(node),
                "tree.nwk",
                "plain/text"
              )
            }
          >
            Export as Newick File
          </button>
        </div>

        <div className="mr-ui-context-menu-divider" />

        { Link }

      </React.Fragment>
    );
  }

  if (node && node.isLeaf) {
    return (
      <React.Fragment>
        <div className="mr-ui-context-menu-item single-action">
          <button
            onClick={() => tree.pinNode(node)}
          >
            { tree.props.pinnedIds?.includes(node.id) ? "Unpin" : "Pin" } Leaf
          </button>
        </div>

        <div className="mr-ui-context-menu-divider" />

        { Link }

      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div
        className="mr-ui-context-menu-item multi-action"
        onClick={(event) => event.stopPropagation()}
      >
        Zoom
        <button
          title="Zoom out"
          onClick={() => tree.zoomOut()}
        >
          <ZoomOutRoundedIcon />
        </button>
        <button
          title="Fit in panel"
          onClick={() => tree.fitInPanel()}
        >
          <ZoomOutMapRoundedIcon />
        </button>
        <button
          title="Zoom in"
          onClick={() => tree.zoomIn()}
        >
          <ZoomInRoundedIcon />
        </button>
      </div>

      <div className="mr-ui-context-menu-item single-action">
        <button
          onClick={
            () => tree.setSource(tree.getGraphWithoutLayout().originalSource)
          }
        >
          Redraw Original Tree
        </button>
      </div>

      <div className="mr-ui-context-menu-divider" />

      <div className="mr-ui-context-menu-item single-action">
        <button
          onClick={
            () => props.onShowLeafLabelsChange(!props.phylocanvasProps.showLeafLabels)
          }
        >
          { props.phylocanvasProps.showLeafLabels ? "Hide" : "Show" } Leaf Labels
        </button>
      </div>
      <div className="mr-ui-context-menu-item single-action">
        <button
          onClick={
            () => props.onAlignLabelsChange(!props.phylocanvasProps.alignLabels)
          }
        >
          { props.phylocanvasProps.alignLabels ? "Unalign" : "Align" } Leaf Labels
        </button>
      </div>

      <div className="mr-ui-context-menu-divider" />

      <div className="mr-ui-context-menu-item single-action">
        <button
          onClick={
            () => tree.midpointRoot()
          }
        >
          Midpoint Root
        </button>
      </div>

      <div className="mr-ui-context-menu-item single-action">
        <button
          onClick={
            () => tree.ascendingNodeOrder()
          }
        >
          Increasing node order
        </button>
      </div>
      <div className="mr-ui-context-menu-item single-action">
        <button
          onClick={
            () => tree.descendingNodeOrder()
          }
        >
          Decreasing node order
        </button>
      </div>

      {/*
      <div className="mr-ui-context-menu-divider" />

      <div className="mr-ui-context-menu-item single-action">
        <button
          onClick={
            () => {
              tree.collapseSimilarNodes();
              tree.fitInPanel();
            }
          }
        >
          { `Collapse nodes with the same ${tree.props.labelField || "label"}` }
        </button>
      </div>
      */}

      {
        (tree.props.collapsedIds && tree.props.collapsedIds.length) > 0 && (
          <div className="mr-ui-context-menu-item single-action">
            <button
              onClick={
                () => tree.resetCollapsedNodes({ refit: true })
              }
            >
              Expand collapsed subtrees
            </button>
          </div>
        )
      }

      <div className="mr-ui-context-menu-divider" />

      <div className="mr-ui-context-menu-item single-action">
        <button
          onClick={
            () => downloadDataUrl(
              tree.getLeafNodes(node).map((x) => x.label).join("\n"),
              "leaf-labels.txt",
              "plain/text"
            )
          }
        >
          Export Leaf Labels
        </button>
      </div>
      <div className="mr-ui-context-menu-item single-action">
        <button
          onClick={
            () => downloadDataUrl(
              tree.exportNewick(),
              "tree.nwk",
              "plain/text"
            )
          }
        >
          Export as Newick File
        </button>
      </div>
      <div className="mr-ui-context-menu-item single-action">
        <button
          onClick={
            () => downloadDataUrl(
              tree.exportPNG(),
              "tree.png",
              "image/png"
            )
          }
        >
          Export as PNG Image
        </button>
      </div>

      <div className="mr-ui-context-menu-divider" />

      { Link }

    </React.Fragment>
  );
});

TreeContextMenu.displayName = "TreeContextMenu";

TreeContextMenu.propTypes = {
  onAlignLabelsChange: PropTypes.func.isRequired,
  onShowLeafLabelsChange: PropTypes.func.isRequired,
  phylocanvasProps: PropTypes.object,
  tree: PropTypes.object,
  node: PropTypes.object,
};

export default TreeContextMenu;
