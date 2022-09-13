import React from "react";
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
          "coordinates": [path],
          "type": "Polygon",
        },
      },
    ],
  };
}

function DrawControl(props) {
  const { onCreate, onUpdate, onDelete, path } = props;
  const [draw, setDraw] = React.useState(null);

  function setMapBoxDrawProps() {
    if (!draw) {
      const mbd = new MapboxDraw(props);
      setDraw(mbd);
      return mbd;
    }
    return draw;
  }

  function onMount(path) {
    if (path) {
      draw.add(getGeoJson(props.path));
      setDraw(draw);

      return () => {
        setDraw(null);
      };
    }
  }

  function onUnMount() {
    setDraw(null);
  }

  useControl(
    setMapBoxDrawProps,
    ({ map }) => {
      map.on("draw.create", onCreate);
      map.on("draw.update", onUpdate);
      map.on("draw.delete", onDelete);
    },
    ({ map }) => {
      map.off("draw.create", onCreate);
      map.off("draw.update", onUpdate);
      map.off("draw.delete", onDelete);
    },
  );

  React.useEffect(() => {
    onMount(path);

    return onUnMount;
  }, [path, draw]);

  return null;
}

export default DrawControl;
