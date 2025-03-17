import PropTypes from "prop-types";
import React from "react";

import { usePresentSelector } from "microreact-viewer/utils/hooks.js";
import regionColoursSelector from "../../selectors/maps/regions-colours.js";

import Component from "./component.js";

function MapColourLegend(props) {
  const regionColours = usePresentSelector((state) => {
    return regionColoursSelector(state, props.mapId);
  });

  const regionsColourScale = usePresentSelector((state) => {
    return state.maps[props.mapId].regionsColourScale;
  });

  return (
    <Component
      regionsColourScale={regionsColourScale}
      colourLegendEntries={regionColours.legendEntries}
    />
  );
}

MapColourLegend.propTypes = {
  mapId: PropTypes.string.isRequired,
};

export default MapColourLegend;
