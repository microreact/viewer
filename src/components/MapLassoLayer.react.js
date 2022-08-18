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

const cursorStyle = {
  cursor: "crosshair",
};

export default class MapLassoOverlay extends React.PureComponent {

  state = {}

  onCanvasOverlayRedraw = ({ width, height, ctx, isDragging, project, unproject }) => {
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

    this.unproject = unproject;
  };

  getPath = () => {
    return this.props.path || this.state.incompletePath;
  }

  getTitle = () => {
    if (this.props.isActive) {
      if (Array.isArray(this.props.path)) {
        return "Click outside the path to clear";
      }
      else if (!this.state.incompletePath || this.state.incompletePath.length === 0) {
        return "Click to draw points";
      }
      else if (this.state.incompletePath.length > 2) {
        return "Click to draw more points, or click on the first point to finish";
      }
      else {
        return "Click to draw more points";
      }
    }
    else {
      return undefined;
    }
  }

  getStyle = () => {
    if (this.props.isActive) {
      if (Array.isArray(this.props.path)) {
        return undefined;
      }
      return cursorStyle;
    }
    else {
      return undefined;
    }
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

    const incompletePath = this.state.incompletePath ? [ ...this.state.incompletePath ] : [];

    if (incompletePath.length > 0) {
      const padding = this.props.pointSize;
      const pointTopLeft = translateFromCanvas(event.offsetX - padding, event.offsetY - padding, this.unproject);
      const pointBottomRight = translateFromCanvas(event.offsetX + padding, event.offsetY + padding, this.unproject);
      if (
        (pointBottomRight[0] >= incompletePath[0][0] && pointTopLeft[0] <= incompletePath[0][0])
        &&
        (
          (pointBottomRight[1] >= incompletePath[0][1] && pointTopLeft[1] <= incompletePath[0][1])
          ||
          (pointBottomRight[1] <= incompletePath[0][1] && pointTopLeft[1] >= incompletePath[0][1])
        )
      ) {
        // push the first point to the end of the path to close the polygon
        // and mark the path as finished
        const path = incompletePath;
        path.push(path[0]);
        this.setState({ incompletePath: null });
        this.props.onPathChange(path);
        return;
      }
    }

    incompletePath.push(point);
    this.setState({ incompletePath });
  };

  offsetX = null;

  offsetY = null;

  handleMousedown = (event) => {
    this.offsetX = event.nativeEvent.offsetX;
    this.offsetY = event.nativeEvent.offsetY;
  };

  handleMouseup = (event) => {
    if (Math.abs(this.offsetX - event.nativeEvent.offsetX) < 5 && Math.abs(this.offsetY - event.nativeEvent.offsetY) < 5) {
      this.handleOnClick(event.nativeEvent);
    }
    this.offsetX = null;
    this.offsetY = null;
  };

  render() {
    if (!this.props.isActive) {
      return null;
    }
    return (
      <div
        className="mr-map-lasso"
        onMouseDown={this.handleMousedown}
        onMouseUp={this.handleMouseup}
        style={this.getStyle()}
        title={this.getTitle()}
      >
        <CanvasOverlay
          path={this.getPath}
          incompletePath={this.state.incompletePath}
          redraw={this.onCanvasOverlayRedraw}
        />
      </div>
    );
  }

}

MapLassoOverlay.displayName = "MapLassoOverlay";

MapLassoOverlay.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onPathChange: PropTypes.func.isRequired,
  path: PropTypes.array,
  pointSize: PropTypes.number,
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
