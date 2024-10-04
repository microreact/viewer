import PropTypes from "prop-types";
import React from "react";

import UiControlsMenu from "./UiControlsMenu.react.js";

import { update } from "../actions/charts.js";

import chartStateSelector from "../selectors/charts/chart-state.js";
import { useAppDispatch, usePresentSelector } from "../utils/hooks.js";
import UiRadioList from "./UiRadioList.react.js";

import { chartTypeOptions } from "./ChartControls.react.js";

function ChartTypeControls(props) {
  const dispatch = useAppDispatch();

  const handleChartTypeTypeChange = (chartType = undefined) => {
    dispatch(update(props.chartId, "type", chartType));
  };

  const chartType = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).type
  );

  return (
    <UiControlsMenu
      title="Chart Type"
      summary={chartTypeOptions.find(((x) => x.value === chartType))?.label ?? undefined}
      className="mr-chart-controls-menu"
      active={!!chartType}
    >
      <UiRadioList
        items={chartTypeOptions}
        onChange={handleChartTypeTypeChange}
        value={chartType}
      />
    </UiControlsMenu>
  );
}

ChartTypeControls.propTypes = {
  chartId: PropTypes.string.isRequired,
};

export default ChartTypeControls;
