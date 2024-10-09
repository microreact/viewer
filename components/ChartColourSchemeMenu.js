import PropTypes from "prop-types";
import React from "react";

import UiControlsMenu from "./UiControlsMenu.react.js";

import { update } from "../actions/charts.js";
import { colourRanges } from "../utils/colours";

import chartStateSelector from "../selectors/charts/chart-state.js";

import { useAppDispatch, usePresentSelector } from "../utils/hooks.js";
import ColourPaletteList from "./ColourPaletteList.react.js";

const listStyle = {
  maxHeight: "calc(100vh - 160px)",
  overflow: "scroll",
};

function ChartColourSchemeMenu(props) {
  const dispatch = useAppDispatch();

  const handleColourSchemeChange = (colourScheme) => {
    dispatch(update(props.chartId, "colourScheme", colourScheme));
  };

  const countableValues = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).countableValues
  );

  const colourScheme = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).colourScheme
  );

  const items = colourRanges.filter((x) => x.entries.length === 2);

  return (
    <UiControlsMenu
      title="Colours"
      className="mr-chart-controls-menu"
      active={countableValues?.length > 0}
    >
      <ColourPaletteList
        bins={0}
        items={items}
        onChange={(x) => handleColourSchemeChange(x.name)}
        value={colourScheme}
        style={listStyle}
      />
    </UiControlsMenu>
  );
}

ChartColourSchemeMenu.propTypes = {
  chartId: PropTypes.string.isRequired,
};

export default ChartColourSchemeMenu;
