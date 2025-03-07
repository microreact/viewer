import PropTypes from "prop-types";
import React from "react";

import { usePresentSelector } from "microreact-viewer/utils/hooks.js";
import regionColoursMapSelector from "../../selectors/maps/regions-colours-map.js";

import Component from "./component.js";

function MapColourLegend(props) {
  const regionColourLegendItems = usePresentSelector((state) => {
    return regionColoursMapSelector(state, props.mapId);
  });

  const regionsColourScale = usePresentSelector((state) => {
    return state.maps[props.mapId].regionsColourScale;
  });

  return (
    <Component
      regionsColourScale={regionsColourScale}
      regionColourLegendItems={regionColourLegendItems}
    />
  );
}

MapColourLegend.propTypes = {
  mapId: PropTypes.string.isRequired,
};

export default MapColourLegend;
