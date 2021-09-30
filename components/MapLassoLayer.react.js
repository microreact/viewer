import React from "react";

import PropTypes from "prop-types";

import { CanvasOverlay } from "react-map-gl";

import { isPointInPolygon } from "../utils/geometry";

function round(x, n) {
  const tenN = (10 ** n);
  return Math.round(x * tenN) / tenN;
}

function drawLines(ctx, coordinates) {
  ctx.moveTo(coordinates[0][0], coordinates[0][1]);
  for (let i = 1; i < coordinates.length; i++) {
    ctx.lineTo(coordinates[i][0], coordinates[i][1]);
  }
  ctx.stroke();
}

function drawPoints(ctx, coordinates, r) {
  for (let i = 0; i < coordinates.length; i++) {
    ctx.fillRect(coordinates[i][0] - r, coordinates[i][1] - r, r * 2, r * 2);
    ctx.strokeRect(
      coordinates[i][0] - r + ctx.lineWidth,
      coordinates[i][1] - r + ctx.lineWidth,
      r * 2 - ctx.lineWidth,
      r * 2 - ctx.lineWidth
    );
  }
}

function translateToCanvas(points, project) {
  // const context = useContext(MapContext);
  // const { viewport } = context;
  // const project = viewport.project.bind(viewport);
  return points.map((position) => {
    const pixel = project(position);
    return [
      round(pixel[0], 1),
      round(pixel[1], 1),
    ];
  });
}

function translateFromCanvas(x, y, unproject) {
  // const context = useContext(MapContext);
  // const { viewport } = context;
  // const unproject = viewport.unproject.bind(viewport);
  const position = unproject([ x, y ]);
  return [
    position[0],
    position[1],
  ];
}

export default class MapLassoOverlay extends React.PureComponent {

  state = {}

  onCanvasOverlayRedraw = ({ width, height, ctx, isDragging, project, unproject }) => {
    if (!this.mouseCanvas) {
      this.addEvents(ctx.canvas);
    }

    const path = this.getPath();

    if (this.props.isActive) {
      ctx.clearRect(0, 0, width, height);

      if (Array.isArray(path) && path.length > 0) {
        const scale = 1;
        ctx.strokeStyle = this.props.strokeStyle;
        ctx.lineWidth = this.props.lineWidth * scale;
        ctx.beginPath();
        const points = translateToCanvas(path, project);
        drawLines(ctx, points);
        ctx.lineWidth = 1 * scale;
        ctx.fillStyle = this.props.pointFillStyle;
        ctx.strokeStyle = this.props.pointStrokeStyle;
        drawPoints(ctx, points, scale * this.props.pointSize / 2);
        ctx.closePath();
      }
    }
    else {
      ctx.clearRect(0, 0, width, height);
    }

    if (this.props.isActive) {
      if (!Array.isArray(path)) {
        ctx.canvas.style.cursor = "crosshair";
        ctx.canvas.title = "Click to draw points";
      }
      else {
        ctx.canvas.style.cursor = null;
        ctx.canvas.title = "Click outside the path to clear";
      }
    }
    else {
      ctx.canvas.style.cursor = null;
      ctx.canvas.title = "";
      // if (lasso.internalPath) {
      //   lasso.internalPath = null;
      // }
    }

    this.unproject = unproject;
  };

  getPath = () => {
    return this.props.path || this.state.internalPath;
  }

  handleOnClick = (event) => {
    if (!this.props.isActive) return;

    const point = translateFromCanvas(event.offsetX, event.offsetY, this.unproject);

    if (Array.isArray(this.props.path)) {
      if (!isPointInPolygon(point, this.props.path)) {
        this.props.onPathChange(null);
      }
      return;
    }

    const internalPath = this.state.internalPath ? [ ...this.state.internalPath ] : [];

    if (internalPath.length > 0) {
      const padding = this.props.pointSize;
      const pointTopLeft = translateFromCanvas(event.offsetX - padding, event.offsetY - padding, this.unproject);
      const pointBottomRight = translateFromCanvas(event.offsetX + padding, event.offsetY + padding, this.unproject);
      if (
        (pointBottomRight[0] >= internalPath[0][0] && pointTopLeft[0] <= internalPath[0][0])
        &&
        (
          (pointBottomRight[1] >= internalPath[0][1] && pointTopLeft[1] <= internalPath[0][1])
          ||
          (pointBottomRight[1] <= internalPath[0][1] && pointTopLeft[1] >= internalPath[0][1])
        )
      ) {
        // push the first point to the end of the path to close the polygon
        // and mark the path as finished
        const path = internalPath;
        path.push(path[0]);
        this.setState({ internalPath: null });
        this.props.onPathChange(path);
        return;
      }
    }

    internalPath.push(point);
    this.setState({ internalPath });
  };

  offsetX = null;

  offsetY = null;

  handleMousedown = (event) => {
    this.offsetX = event.offsetX;
    this.offsetY = event.offsetY;
  };

  handleMouseup = (event) => {
    if (Math.abs(this.offsetX - event.offsetX) < 5 && Math.abs(this.offsetY - event.offsetY) < 5) {
      this.handleOnClick(event);
    }
    this.offsetX = null;
    this.offsetY = null;
  };

  addEvents = (mouseCanvas) => {
    this.mouseCanvas = mouseCanvas;
    this.mouseCanvas.addEventListener("mousedown", this.handleMousedown, false /* useCapture */);
    this.mouseCanvas.addEventListener("mouseup", this.handleMouseup, false /* useCapture */);
  }

  removeEvents = () => {
    this.mouseCanvas?.removeEventListener("mousedown", this.handleMousedown);
    this.mouseCanvas?.removeEventListener("mouseup", this.handleMouseup);
  }

  componentWillUnmount() {
    this.removeEvents();
  }

  render() {
    if (!this.props.isActive) {
      return null;
    }
    return (
      <CanvasOverlay
        path={this.getPath}
        internalPath={this.state.internalPath}
        redraw={this.onCanvasOverlayRedraw}
      />
    );
  }

}

MapLassoOverlay.displayName = "MapLassoOverlay";

MapLassoOverlay.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onPathChange: PropTypes.func.isRequired,
  path: PropTypes.array,
};

MapLassoOverlay.defaultProps = {
  dotsStyle: "#383838",
  isActive: false,
  lineWidth: 2,
  path: null,
  pointFillStyle: "#ffffff",
  pointSize: 14,
  pointStrokeStyle: "#000000",
  strokeStyle: "#3C7383",
};
