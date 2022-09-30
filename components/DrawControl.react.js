import React from "react";
import PropTypes from "prop-types";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useControl } from "react-map-gl";

function getGeoJson(path) {
  return {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "coordinates": [ path ],
          "type": "Polygon",
        },
      },
    ],
  };
}

function DrawControl(props) {
  const [ draw, setDraw ] = React.useState(null);

  useControl(
    () => {
      if (!draw) {
        const mbd = new MapboxDraw(props);
        setDraw(mbd);
        return mbd;
      }
      return draw;
    },
    ({ map }) => {
      map.on("draw.create", props.onCreate);
      map.on("draw.update", props.onUpdate);
      map.on("draw.delete", props.onDelete);
    },
    ({ map }) => {
      map.off("draw.create", props.onCreate);
      map.off("draw.update", props.onUpdate);
      map.off("draw.delete", props.onDelete);
    },
  );

  React.useEffect(
    () => {
      if (props.path) {
        draw.add(getGeoJson(props.path));
        setDraw(draw);
      }

      return () => {
        setDraw(null);
      };
    },
    [
      props.path,
      draw,
    ],
  );

  return null;
}

DrawControl.propTypes = {
  onCreate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  path: PropTypes.array,
};

export default DrawControl;
