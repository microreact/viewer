import PropTypes from "prop-types";
import React from "react";
import {
  Source,
  Layer,
} from "react-map-gl";

const MapGeojsonLayer = React.memo(
  (props) => {
    if (props.showRegions && props.layerData) {
      return (
        <Source
          type="geojson"
          data={props.layerData}
        >
          <Layer
            id="mr-geojson-layer"
            type="fill"
            paint={props.layerStyle}
          />
        </Source>
      );
    }
    else {
      return null;
    }
  },
);

MapGeojsonLayer.displayName = "MapGeojsonLayer";

MapGeojsonLayer.propTypes = {
  layerData: PropTypes.object.isRequired,
  layerStyle: PropTypes.object.isRequired,
  mapId: PropTypes.string.isRequired,
  showRegions: PropTypes.bool.isRequired,
};

export default MapGeojsonLayer;
