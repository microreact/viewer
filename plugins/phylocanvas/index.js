import PhylocanvasGL, { TreeTypes, plugins } from "@phylocanvas/phylocanvas.gl";

import convertState from "./convert-state";

const treeTypeLabels = Object.entries(TreeTypes).reduce(
  (prev, [ label, value ]) => {
    prev[value] = label;
    return prev;
  },
  {},
);

export default function (treePane) {
  return class Phylocanvas extends PhylocanvasGL {
    constructor(view, props) {
      super(
        view,
        props,
        [
          plugins.scalebar,
        ]
      );
      const tree = this;

      tree.deck.setProps({
        // _onMetrics: (metrics) => {
        //   if (treePane?.framerateRef?.current) {
        //     treePane.framerateRef.current.innerHTML = `${metrics.fps.toFixed(0)} fps`;
        //   }
        // },
        getCursor: (info) => {
          if (treePane.props.isLassoActive && !Array.isArray(tree?.lasso?.path)) {
            return null;
          }
          else {
            return info.isDragging ? "grabbing" : "grab";
          }
        },
      });

      tree.convertState = convertState.bind(tree, tree);
    }

    collapseNode(node) {
      super.collapseNode(node);
      treePane.props.onAddHistoryEntry("Collapse subtree");
    }

    handleClick(info, event) {
      const tree = this;
      if (tree.lassoClickHandler) {
        tree.lassoClickHandler(event);
        return;
      }
      const node = tree.pickNodeFromLayer(info);
      if (event.rightButton) {
        event.preventDefault();
        treePane.setState({
          contextMenuPosition: {
            left: event.center.x,
            top: event.center.y,
          },
          contextMenuNode: node,
        });
      }
      else if (node && event.srcEvent.shiftKey && this.props.selectedIds && this.props.selectedIds.length) {
        const lastSelectedNode = this.findNodeById(this.props.selectedIds[this.props.selectedIds.length - 1]);
        const nodes = this.getGraphAfterLayout();
        const lastSelectedNodeIndex = nodes.leaves.indexOf(lastSelectedNode);
        const clickedNodeIndex = nodes.leaves.indexOf(node);
        const first = Math.min(lastSelectedNodeIndex + 1, clickedNodeIndex);
        const last = Math.max(lastSelectedNodeIndex - 1, clickedNodeIndex);
        const ids = [];
        for (let index = first; index <= last; index++) {
          ids.push(nodes.leaves[index].id);
        }
        this.selectLeafNodes(ids, true);
      }
      else {
        this.selectNode(node, event.srcEvent.metaKey || event.srcEvent.ctrlKey);
      }
    }

    getLeafNodes(nodeOrId, { includeHidden = false } = {}) {
      const nodes = this.getGraphWithStyles();

      const subtreeNode = nodeOrId ? this.findNodeById(nodeOrId) : nodes.root;

      const leafNodes = [];
      for (let i = subtreeNode.preIndex; i < subtreeNode.preIndex + subtreeNode.totalNodes; i++) {
        const node = nodes.preorderTraversal[i];
        if (node.isLeaf && (includeHidden || !node.isHidden)) {
          leafNodes.push(node);
        }
      }

      return leafNodes;
    }

    rerootNode(node) {
      super.rerootNode(node);
      treePane.props.onAddHistoryEntry("Re-root tree");
    }

    setRoot(nodeOrId) {
      super.setRoot(
        nodeOrId,
        { ids: this.getLeafNodes(nodeOrId).map((x) => x.id) },
      );
      treePane.props.onAddHistoryEntry("View subtree");
    }

    selectNode(node, isAppend) {
      const tree = this;
      if (node && node.isLeaf) {
        treePane.props.onSelectRows([ node.id ], isAppend);
      }
      else {
        // prevent node selection when a lasso path is being drawn
        if (treePane.props.lassoPath) {
          if (treePane.props.selectedIds.length) {
            treePane.props.onSelectRows();
          }
          return;
        }
        if (node && !node.isHidden) {
          const nodes = tree.getLeafNodes(node, { includeHidden: true });
          if (isAppend) {
            treePane.props.onSelectRows(nodes.map((x) => x.id), isAppend);
          }
          else {
            treePane.props.onFilterChange(nodes.map((x) => x.id));
          }
        }
        else if (!isAppend) {
          if (treePane.props.selectedIds.length) {
            treePane.props.onSelectRows();
          }
          else {
            treePane.props.onFilterChange(null);
          }
        }
      }
    }

    // eslint-disable-next-line class-methods-use-this
    selectLeafNodes(ids, isAppend) {
      // prevent node selection when a lasso path is being drawn
      if (ids && Array.isArray(ids)) {
        treePane.props.onSelectRows(ids, isAppend);
      }
    }

    setTreeType(type) {
      super.setTreeType(type);
      treePane.props.onAddHistoryEntry(`Set tree type to ${treeTypeLabels[type]}`);
    }

    zoomIn() {
      this.setZoom(this.getZoom() + 0.1);
    }

    zoomOut() {
      this.setZoom(this.getZoom() - 0.1);
    }

    absolutePointToRelativePoint([ pointX, pointY ]) {
      const { root } = this.getGraphAfterLayout();
      return [
        (pointX - root.x) / this.getBranchScale(),
        (pointY - root.y) / this.getStepScale(),
      ];
    }

    relativePointToAbsolutePoint([ pointX, pointY ]) {
      const { root } = this.getGraphAfterLayout();
      return [
        (pointX * this.getBranchScale()) + root.x,
        (pointY * this.getStepScale()) + root.y,
      ];
    }

    // Moved to componentDidMount to avoid updating the store when tree loads
    // tree.setProps = (updater) => {
    //   // console.debug('setState', Object.keys(updater));
    //   component.props.onPhylocanvasPropsChange(updater);
    // };
  };
}
