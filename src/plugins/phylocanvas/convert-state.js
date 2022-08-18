/* eslint-disable max-classes-per-file */

import { TreeTypes, Angles } from "@phylocanvas/phylocanvas.gl";

class Tree {
  constructor(tree, state) {
    this.tree = tree;
    this.stepScale = state.stepScale;
    this.branchScale = state.branchScale;
    this.offsetX = state.offsetX;
    this.offsetY = state.offsetY;
    this.scale = state.scale;
    this.size = state.prevSize;
    this.padding = state.padding;
    this.includeLabelAlignment = false;
    this.bounds = this.getBounds();
  }

  getPostorderTraversal() {
    const nodes = this.tree.getNodes();
    const postorderTraversal = nodes.postorderTraversal.map((node) => ({
      ...node,
      parent: (node.parent || {}).postIndex,
      children: node.children ? node.children.map((_) => _.postIndex) : undefined,
    }));
    postorderTraversal.forEach((node) => {
      node.parent = postorderTraversal[node.parent];
      node.children = node.children ? node.children.map((_) => postorderTraversal[_]) : undefined;
    });
    return postorderTraversal;
  }

  getBounds() {
    const nodes = Array.from(this.getLeaves());
    return {
      minX: nodes.reduce((acc, v) => (acc.x < v.x ? acc : v)).x,
      minY: nodes.reduce((acc, v) => (acc.y < v.y ? acc : v)).y,
      maxX: nodes.reduce((acc, v) => (acc.x > v.x ? acc : v)).x,
      maxY: nodes.reduce((acc, v) => (acc.y > v.y ? acc : v)).y,
    };
  }
}

class Radial extends Tree {
  * getLeaves() {
    let stepOffset = 0;

    const postorderTraversal = this.getPostorderTraversal();
    const preorderTraversal = new Array(postorderTraversal.length);
    for (const node of postorderTraversal) {
      preorderTraversal[node.preIndex] = node;
    }
    const rootIdx = this.tree.getNodes().root.preIndex;
    const root = preorderTraversal[rootIdx];

    for (let i = root.postIndex - root.totalNodes + 1; i <= root.postIndex; i++) {
      const node = postorderTraversal[i];

      if (node.isLeaf) {
        // leaf nodes are angled at step offsets (use a fixed step angle for all leaf nodes)
        node.angle = stepOffset * (Angles.Degrees360 / root.visibleLeaves);
      } else {
        let angle = 0;
        for (const child of node.children) {
          angle += (child.angle * child.totalLeaves);
        }
        node.angle = angle / node.totalLeaves;
      }

      if (node.isLeaf && !node.isHidden || node.isCollapsed && !node.isHidden) {
        stepOffset += 1;
      }
    }

    for (let i = root.preIndex; i < root.preIndex + root.totalNodes; i++) {
      const node = preorderTraversal[i];
      // calculate vector horizontal and vertical components to position the node
      const dist = node.branchLength * this.branchScale;
      node.x = (node !== root ? node.parent.x : 0) + dist * Math.cos(node.angle);
      node.y = (node !== root ? node.parent.y : 0) + dist * Math.sin(node.angle);

      if (node.isLeaf) {
        yield { x: node.x, y: node.y, angle: node.angle };
      }
    }
  }

  getBranchScale() {
    const totalLength = Math.min(this.width, this.height) / 2;
    const nodes = this.tree.getNodes();

    if (nodes.root.totalLeafLength > 0) {
      return totalLength / nodes.root.totalLeafLength;
    }

    if (nodes.root.totalLeafLength < 0) {
      return totalLength * nodes.root.totalLeafLength;
    }

    return 0;
  }
}

class Rectangular extends Tree {
  constructor(tree, state) {
    super(tree, state);
    this.mainAxis = "x";
  }

  * getLeaves() {
    const nodes = this.tree.getNodes();
    const branchScale = this.branchScale;
    yield { x: 0, y: 0, angle: Angles.Degrees0 };
    yield { x: nodes.root.totalSubtreeLength * branchScale, y: this.stepScale * (nodes.root.visibleLeaves), angle: Angles.Degrees0 };
  }

  getBranchScale() {
    const nodes = this.tree.getNodes();
    const treeHeight = nodes.root.visibleLeaves * this.stepScale;
    const treeWidth = (this.size.width / this.size.height) * treeHeight;
    const totalLeafLength = nodes.root.totalLeafLength;
    return treeWidth / totalLeafLength;
  }
}

class Circular extends Tree {
  constructor(...args) {
    super(...args);
    this.includeLabelAlignment = this.tree.alignLabels;
    this.bounds = this.getBounds();
  }

  * getLeaves() {
    let stepOffset = 0;

    const { root } = this.tree.getNodes();
    const postorderTraversal = this.getPostorderTraversal();

    for (let i = root.postIndex - root.totalNodes + 1; i <= root.postIndex; i++) {
      const node = postorderTraversal[i];

      if (node.isLeaf) {
        // leaf nodes are angled at step offsets (use a fixed step angle for all leaf nodes)
        const angle = stepOffset * (Angles.Degrees360 / root.visibleLeaves);
        // calculate vector horizontal and vertical components to position the node

        const distanceFromRoot = node.distanceFromRoot - root.distanceFromRoot;
        const dist = distanceFromRoot * this.branchScale;
        const x = dist * Math.cos(angle);
        const y = dist * Math.sin(angle);
        yield { x, y, angle };
      }

      if (node.isLeaf && !node.isHidden || node.isCollapsed && !node.isHidden) {
        stepOffset += 1;
      }
    }
  }

  getBranchScale() {
    const totalLength = Math.min(this.width, this.height) / 2;
    const nodes = this.tree.getNodes();

    if (nodes.root.totalLeafLength > 0) {
      return totalLength / nodes.root.totalLeafLength;
    }

    if (nodes.root.totalLeafLength < 0) {
      return totalLength * nodes.root.totalLeafLength;
    }

    return 0;
  }
}

class Diagonal extends Tree {
  constructor(tree, state) {
    super(tree, state);
    this.mainAxis = "x";
  }

  * getLeaves() {
    const nodes = this.tree.getNodes();
    const { root } = nodes;
    const maxY = (root.visibleLeaves - 1) * this.stepScale;
    const maxX = maxY / 2;
    yield { x: 0, y: 0, angle: Angles.Degrees0 };
    yield { x: maxX, y: maxY, angle: Angles.Degrees0 };
  }

  getBranchScale() {
    const nodes = this.tree.getNodes();
    const totalLength = (this.size.width - this.padding * 2);
    if (nodes.root.totalLeafLength > 0) {
      return totalLength / nodes.root.totalLeafLength;
    }
    if (nodes.root.totalLeafLength < 0) {
      return totalLength * nodes.root.totalLeafLength;
    }
    return 0;
  }
}

class Hierarchical extends Tree {
  constructor(tree, state) {
    super(tree, state);
    this.mainAxis = "y";
  }

  * getLeaves() {
    const nodes = this.tree.getNodes();
    const { root } = nodes;
    const angle = Angles.Degrees90;
    const maxY = root.totalSubtreeLength * this.branchScale;
    const minX = -1 * (root.visibleLeaves - 1) * this.stepScale;
    yield { x: minX, y: 0, angle };
    yield { x: 0, y: maxY, angle };
  }

  getBranchScale() {
    const nodes = this.tree.getNodes();
    const treeWidth = nodes.root.visibleLeaves * this.stepScale;
    const treeHeight = (this.size.height / this.size.width) * treeWidth;
    const totalLeafLength = nodes.root.totalSubtreeLength;
    return treeHeight / totalLeafLength;
  }
}

export default function (tree) {
  const oldState = { ...tree.props };

  tree.setProps({
    offsetX: undefined,
    offsetY: undefined,
    branchScale: undefined,
    stepScale: undefined,
    scale: undefined,
    renderLabels: undefined,
    renderInternalLabels: undefined,
    renderBranchLengths: undefined,
    renderLeafLabels: undefined,
    renderLeafBorders: undefined,
    showNodes: undefined,
    showLabels: oldState.renderLabels,
    showInternalLabels: oldState.renderInternalLabels,
    showBranchLengths: oldState.renderBranchLengths,
    showLeafLabels: oldState.renderLeafLabels,
    showShapeBorders: oldState.renderLeafBorders,
    showShapes: oldState.showNodes,
  });

  const TreeFactory = {
    [TreeTypes.Radial]: Radial,
    [TreeTypes.Rectangular]: Rectangular,
    [TreeTypes.Circular]: Circular,
    [TreeTypes.Diagonal]: Diagonal,
    [TreeTypes.Hierarchical]: Hierarchical,
  }[oldState.type];
  const treeObj = new TreeFactory(tree, oldState);
  const oldBounds = treeObj.bounds;
  const defaultBranchScale = treeObj.getBranchScale();

  const currentState = tree.props;

  tree.props = { ...tree.props };

  tree.props.size = oldState.prevSize;

  function getDefaultScale() {
    const bounds = oldBounds;
    const area = {
      width: tree.props.size.width,
      height: tree.props.size.height,
      left: tree.props.padding,
      top: tree.props.padding,
      right: tree.props.size.width - tree.props.padding,
      bottom: tree.props.size.height - tree.props.padding,
    };

    const treeWidth = bounds.maxX - bounds.minX;
    const treeHeight = bounds.maxY - bounds.minY;
    const canvasWidth = Math.max(
      area.width * 0.333,
      area.right - area.left - tree.props.nodeSize
    );
    const canvasHeight = Math.max(
      area.height * 0.333,
      area.bottom - area.top - tree.props.nodeSize
    );
    const xZoomRatio = canvasWidth / treeWidth;
    const yZoomRatio = canvasHeight / treeHeight;
    const scale = Math.min(xZoomRatio, yZoomRatio);
    return scale;
  }

  const treeWidth = oldBounds.maxX - oldBounds.minX;
  const treeHeight = oldBounds.maxY - oldBounds.minY;
  const treeCenterX = ((oldBounds.minX + (treeWidth / 2)) * oldState.scale) + oldState.offsetX;
  const treeCenterY = ((oldBounds.minY + (treeHeight / 2)) * oldState.scale) + oldState.offsetY;
  const defaultScale = getDefaultScale();

  const area = tree.getDrawingArea();

  tree.props = currentState;

  tree.setProps({
    transform: {
      ...tree.props.transform,
      x: (treeCenterX / area.width),
      y: (treeCenterY / area.height),
      z: oldState.scale / defaultScale,
      branch: oldState.branchScale / defaultBranchScale,
      step: oldState.stepScale / 8,
    },
  });
}
