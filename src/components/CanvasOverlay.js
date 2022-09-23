import React from "react";
import PropTypes from "prop-types";
import { useControl } from "react-map-gl";

// Based on template in https://docs.mapbox.com/mapbox-gl-js/api/markers/#icontrol
class OverlayControl {
  _map = null;

  _container;

  _redraw;

  constructor(redraw) {
    this._redraw = () => {
      const canvas = this.getElement();
      const ctx = this.getElement()?.getContext("2d");
      if (ctx) {
        const width = this._map.getContainer().clientWidth;
        const height = this._map.getContainer().clientHeight;
        const pixelRatio = (typeof window !== "undefined" && window.devicePixelRatio) || 1; // eslint-disable-line no-undef

        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.save();
        ctx.scale(pixelRatio, pixelRatio);

        redraw({
          width,
          height,
          ctx,
          project: this._map.project.bind(this._map),
          unproject: this._map.unproject.bind(this._map),
        });

        ctx.restore();
      }
    };
  }

  onAdd(map) {
    this._map = map;
    map.on("move", this._redraw);
    /* global document */
    this._container = document.createElement("canvas");
    this._redraw();
    return this._container;
  }

  onRemove() {
    this._container.remove();
    this._map.off("move", this._redraw);
    this._map = null;
  }

  getMap() {
    return this._map;
  }

  getElement() {
    return this._container;
  }
}

/**
 * A custom control that rerenders arbitrary React content whenever the camera changes
 */
function CustomOverlay(props) {
  const ctrl = useControl(() => new OverlayControl(props.redraw));

  React.useEffect(ctrl._redraw);

  return null;
}

CustomOverlay.propTypes = {
  redraw: PropTypes.func,
};

export default React.memo(CustomOverlay);
