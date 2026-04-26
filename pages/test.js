import React from "react";
import Map, { useMap } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

function SetGlobeProjection() {
  const { current: map } = useMap();

  React.useEffect(() => {
    if (!map) return;

    const applyGlobe = () => {
      console.log("first", map)
      map.getMap().setProjection({ type: "globe" });
    };

    map.on("style.load", applyGlobe);

    // In case style is already loaded
    if (map.isStyleLoaded()) {
      applyGlobe();
    }

    return () => {
      map.off("style.load", applyGlobe);
    };
  }, [map]);

  return null;
}

export default function GlobeMap() {
  return (
    <Map
      initialViewState={{
        longitude: 0,
        latitude: 20,
        zoom: 1.5
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="https://demotiles.maplibre.org/style.json"
      maxPitch={85}
    >
      <SetGlobeProjection />
    </Map>
  );
}