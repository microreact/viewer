import PropTypes from "prop-types";
import React from "react";

import UiAnimation from "./UiAnimation.react";
import UiControlsButton from "./UiControlsButton.react";

import ChartTypeControls from "./ChartTypeControls.js";
import ChartCategoriesControls from "./ChartCategoriesControls.js";
import ChartSeriesColumnMenu from "./ChartSeriesColumnMenu.js";
import ChartCountableValuesMenu from "./ChartCountableValuesMenu.js";
import ChartColourSchemeMenu from "./ChartColourSchemeMenu.js";

import {
  useAppDispatch,
  useChartStateSelector,
} from "../utils/hooks.js";

import { update } from "../actions/charts.js";

function MultiVariableBarChartControls(props) {
  const dispatch = useAppDispatch();

  const handleControlsChange = (controls) => {
    dispatch(update(props.chartId, "controls", controls));
  };

  const controls = useChartStateSelector(
    (chartState) => chartState.controls,
    props.chartId,
  );

  return (
    <div className="mr-main-controls">
      <UiControlsButton
        active={controls}
        onClick={() => handleControlsChange(!controls)}
      />
      <UiAnimation in={controls}>
        <ChartColourSchemeMenu chartId={props.chartId} />
        <ChartCountableValuesMenu chartId={props.chartId} />
        <ChartCategoriesControls chartId={props.chartId} />
        <ChartSeriesColumnMenu chartId={props.chartId} />
        <ChartTypeControls chartId={props.chartId} />
      </UiAnimation>
  </div>
  );
}

MultiVariableBarChartControls.propTypes = {
  chartId: PropTypes.string.isRequired,
};

export default MultiVariableBarChartControls;
