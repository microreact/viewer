import PropTypes from "prop-types";
import React from "react";

import UiAnimation from "./UiAnimation.react";
import UiControlsButton from "./UiControlsButton.react";

import ChartTypeControls from "./ChartTypeControls.js";
import ChartCategoriesControls from "./ChartCategoriesControls.js";
import ChartSliceScaleControls from "./ChartSliceScaleControls.js";
import ChartSliceLabelsControls from "./ChartSliceLabelsControls.js";
import { useAppDispatch, useChartStateSelector } from "../utils/hooks.js";

import { update } from "../actions/charts.js";
import ChartSeriesColumnMenu from "./ChartSeriesColumnMenu.js";

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