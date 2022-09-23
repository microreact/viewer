import React from "react";
import { useControl } from "react-map-gl";
import { createPortal } from "react-dom";

// Based on template in https://docs.mapbox.com/mapbox-gl-js/api/markers/#icontrol
class OverlayControl {
  _map = null;

  _container = null;

  _redraw = null;

  constructor(redraw) {
    this._redraw = redraw;
  }

  onAdd(map) {
    this._map = map;
    map.on("move", this._redraw);
    /* global document */
    this._container = document.createElement("div");
    this._container.classList.add("mr-custom-overlay");
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
  const [ version, setVersion ] = React.useState(0);

  const ctrl = useControl(
    () => {
      const forceUpdate = () => setVersion((v) => (v + 1));
      return new OverlayControl(forceUpdate);
    },
  );

  const map = ctrl.getMap();

  return (
    map
    &&
    createPortal(
      React.cloneElement(
        props.children,
        { map, version },
      ),
      ctrl.getElement(),
    )
  );
}

export default React.memo(CustomOverlay);
