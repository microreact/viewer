import PropTypes from "prop-types";
import React from "react";

import UiControlsMenu from "./UiControlsMenu.react.js";
import UiRadioList from "./UiRadioList.react.js";

import { update } from "../actions/charts.js";
import { colourSteps, colourRanges } from "../utils/colours";

import chartStateSelector from "../selectors/charts/chart-state.js";

import { useAppDispatch, usePresentSelector } from "../utils/hooks.js";
import UiSelectList from "./UiSelectList.react.js";
import activeRowsSelector from "../selectors/filters/active-rows.js";
import { emptyArray } from "../constants.js";
import GradientColourPalettePicker from "./GradientColourPalettePicker.react.js";
import ColourPaletteList from "./ColourPaletteList.react.js";

const options = [
  { value: "count", label: "Count" },
  { value: "percentage", label: "Percentage" },
];

function ChartColourSchemeMenu(props) {
  const dispatch = useAppDispatch();

  const handleColourSchemeChange = (colourScheme) => {
    dispatch(update(props.chartId, "colourScheme", colourScheme));
  };

  const activeRows = usePresentSelector(activeRowsSelector);

  const seriesFields = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).seriesFields ?? emptyArray
  );

  const countableValues = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).countableValues
  );

  const colourScheme = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).colourScheme
  );

  // const colourRange = colourRanges.find((x) => x.name === colourRangeName);

  return (
    <UiControlsMenu
      title="Colours"
      className="mr-chart-controls-menu"
      active={countableValues?.length > 0}
    >
      <ColourPaletteList
        bins={0}
        items={colourRanges.filter((x) => x.entries.length === 2)}
        onChange={(x) => handleColourSchemeChange(x.name)}
        value={colourScheme}
      />
    </UiControlsMenu>
  );
}

ChartColourSchemeMenu.propTypes = {
  chartId: PropTypes.string.isRequired,
};

export default ChartColourSchemeMenu;
