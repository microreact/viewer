import React from "react";
import PropTypes from "prop-types";

import CanvasOverlay from "./CanvasOverlay";

import { drawShape, drawPieChart } from "../utils/drawing";
import defaults from "../defaults";
import { MapMarker } from "../utils/prop-types";

function round(x, n) {
  const tenN = 10 ** n;
  return Math.round(x * tenN) / tenN;
}

class MapMarkersLayer extends React.Component {

  canvasRef = React.createRef();

  onCanvasOverlayRedraw = ({ width, height, ctx, isDragging, project, unproject }) => {
    const {
      compositeOperation,
      globalOpacity,
    } = this.props;

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = compositeOperation;
    ctx.globalAlpha = globalOpacity;

    if (this.props.showMarkers && this.props.markers) {
      for (const marker of this.props.markers) {
        if (marker.rows.length > 0) {
          const pixel = project(marker.position);
          const pixelX = round(pixel.x, 1);
          const pixelY = round(pixel.y, 1);

          if (
            pixelX + this.props.nodeRadius >= 0 &&
            pixelX - this.props.nodeRadius < width &&
            pixelY + this.props.nodeRadius >= 0 &&
            pixelY - this.props.nodeRadius < height
          ) {

            const isHighlighted = marker.rows.some((row) => this.props.selectedIds.has(row[0]));
            const size = (
              this.props.fixedSize
                ?
                this.props.nodeRadius
                :
                this.props.minScaledMarkerRadius + (this.props.maxScaledMarkerRadius - this.props.minScaledMarkerRadius) * marker.ratio
            );

            if (marker.slices) {
              drawPieChart(
                ctx,
                pixelX,
                pixelY,
                size,
                marker.slices,
                isHighlighted && defaults.THEME.COLOURS.GREEN
              );
            }
            else {
              drawShape(
                ctx,
                pixelX,
                pixelY,
                size,
                marker.rows[0]["--microreact-shape"],
                marker.rows[0]["--microreact-colour"],
                isHighlighted && defaults.THEME.COLOURS.GREEN
              );
            }

            marker.minx = pixelX - size;
            marker.maxx = pixelX + size;
            marker.miny = pixelY - size;
            marker.maxy = pixelY + size;
          }
        }
      }
    }
  };

  componentDidMount() {

    this.redraw();
  }

  componentDidUpdate() {
    this.redraw();
  }

  redraw() {
    console.log("redraw method is called ", this);
    const { props, canvasRef } = this;
    const width = props.map.getContainer().clientWidth;
    const height = props.map.getContainer().clientHeight;
    const ctx = canvasRef.current?.getContext("2d");

    this.onCanvasOverlayRedraw({
      width,
      height,
      ctx,
      project: props.map.project.bind(props.map),
      unproject: props.map.unproject.bind(props.map),
    });
  }

  render() {
    //   () => {
    // const canvas = this.getElement();
    // const ctx = this.getElement()?.getContext("2d");
    // if (ctx) {

    //
    //   canvas.width = width * pixelRatio;
    //   canvas.height = height * pixelRatio;
    //   canvas.style.width = `${width}px`;
    //   canvas.style.height = `${height}px`;
    //
    //   ctx.save();
    //   ctx.scale(pixelRatio, pixelRatio);
    //
    //   redraw({
    //     width,
    //     height,
    //     ctx,
    //     project: this._map.project.bind(this._map),
    //     unproject: this._map.unproject.bind(this._map),
    //   });
    //
    //   ctx.restore();
    // }

    const { props, canvasRef } = this;
    const width = props.map.getContainer().clientWidth;
    const height = props.map.getContainer().clientHeight;
    const pixelRatio = (typeof window !== "undefined" && window.devicePixelRatio) || 1;

    return (
        <canvas
            ref={canvasRef}
            width={width * pixelRatio}
            height={height * pixelRatio}
            style={{
              height: `${height}px`,
              width: `${width}px`,
            }}
        />
    );
  }

}

MapMarkersLayer.displayName = "MapMarkersOverlay";

MapMarkersLayer.propTypes = {
  compositeOperation: PropTypes.string,
  dotFill: PropTypes.string,
  dotRadius: PropTypes.number,
  globalOpacity: PropTypes.number,
  markers: PropTypes.arrayOf(MapMarker).isRequired,
  renderWhileDragging: PropTypes.bool,
  showMarkers: PropTypes.bool.isRequired,
};

MapMarkersLayer.defaultProps = {
  renderWhileDragging: true,
  dotRadius: 4,
  dotFill: "#1FBAD6",
  globalOpacity: 0.1,
  // Same as browser default.
  compositeOperation: "source-over",
};

export default function (props) {
  return (
    <CanvasOverlay>
      <MapMarkersLayer {...props}/>
    </CanvasOverlay>
  );
}
