import React from "react";
import PropTypes from "prop-types";

import { CanvasOverlay } from "react-map-gl";

import { drawShape, drawPieChart } from "../utils/drawing";
import defaults from "../defaults";
import { MapMarker } from "../utils/prop-types";

function round(x, n) {
  const tenN = 10 ** n;
  return Math.round(x * tenN) / tenN;
}

export default class MapMarkersLayer extends React.PureComponent {

  canvasOverlayRef = React.createRef()

  markerBounds = []

  onCanvasOverlayRedraw = ({ width, height, ctx, isDragging, project, unproject }) => {
    const {
      compositeOperation,
      renderWhileDragging,
      globalOpacity,
    } = this.props;

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = compositeOperation;
    ctx.globalAlpha = globalOpacity;

    if ((renderWhileDragging || !isDragging) && this.props.showMarkers && this.props.markers) {
      for (const marker of this.props.markers) {
        if (marker.rows.length > 0) {
          const pixel = project(marker.position);
          const pixelX = round(pixel[0], 1);
          const pixelY = round(pixel[1], 1);

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

  render() {
    return (
      <CanvasOverlay
        {...this.props}
        redraw={this.onCanvasOverlayRedraw}
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
