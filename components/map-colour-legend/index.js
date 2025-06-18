import PropTypes from "prop-types";
import React from "react";

import { usePresentSelector } from "../../utils/hooks.js";
import regionColoursSelector from "../../selectors/maps/regions-colours.js";
import entryLabelsSelector from "../../selectors/config/entry-labels.js";

import Component from "./component.js";

function MapColourLegend(props) {
  const regionColours = usePresentSelector((state) => {
    return regionColoursSelector(state, props.mapId);
  });

  const regionsColourScale = usePresentSelector((state) => {
    return state.maps[props.mapId].regionsColourScale;
  });

  const regionsColourMethod = usePresentSelector((state) => {
    return state.maps[props.mapId].regionsColourMethod;
  });

  const entryLabels = usePresentSelector(entryLabelsSelector);

  return (
    <Component
      colourLegendEntries={regionColours.legendEntries}
      entryLabels={entryLabels}
      regionsColourMethod={regionsColourMethod}
      regionsColourScale={regionsColourScale}
    />
  );
}

MapColourLegend.propTypes = {
  mapId: PropTypes.string.isRequired,
};

export default MapColourLegend;
