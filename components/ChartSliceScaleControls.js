import PropTypes from "prop-types";
import React from "react";

import UiControlsMenu from "./UiControlsMenu.react.js";

import { update } from "../actions/charts.js";

import chartStateSelector from "../selectors/charts/chart-state.js";
import { useAppDispatch, usePresentSelector } from "../utils/hooks.js";
import UiRadioList from "./UiRadioList.react.js";
import UiToggleSwitch from "./UiToggleSwitch.react.js";

const scaleTypes = [
  { value: "radius", label: "By Radius" },
  { value: "area", label: "By area" },
];

function ChartSliceScaleControls(props) {
  const dispatch = useAppDispatch();
  const handleSliceScaleTypeChange = (sliceScaleType = undefined) => {
    dispatch(update(props.chartId, "sliceScaleType", sliceScaleType));
  };
  const handleHideNullValuesChange = (excludeNullValues = undefined) => {
    dispatch(update(props.chartId, "excludeNullValues", excludeNullValues));
  };
  const sliceScaleType = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).sliceScaleType
  );
  const excludeNullValues = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).excludeNullValues
  );
  return (
    <UiControlsMenu
      title="Scale slices"
      summary="Slices"
      className="mr-chart-controls-menu"
      onClear={sliceScaleType && (() => handleSliceScaleTypeChange(undefined))}
    >
      <UiRadioList
        nullable
        nullOptionLabel="None"
        items={scaleTypes}
        onChange={handleSliceScaleTypeChange}
        value={sliceScaleType}
      />

      <hr />

      <UiToggleSwitch
        label="Hide null values"
        onChange={handleHideNullValuesChange}
        value={excludeNullValues}
      />
    </UiControlsMenu>
  );
}

ChartSliceScaleControls.propTypes = {
  chartId: PropTypes.string.isRequired,
};

export default ChartSliceScaleControls;
