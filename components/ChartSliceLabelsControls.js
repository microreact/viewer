import PropTypes from "prop-types";
import React from "react";

import UiControlsMenu from "./UiControlsMenu.react.js";

import { update } from "../actions/charts.js";

import chartStateSelector from "../selectors/charts/chart-state.js";
import { useAppDispatch, usePresentSelector } from "../utils/hooks.js";
import UiRadioList from "./UiRadioList.react.js";
import UiToggleSlider from "./UiToggleSlider.react.js";

const nullValue = "off";

const options = [
  { value: nullValue, label: "Off" },
  { value: "inside", label: "Inside slice" },
  { value: "outside", label: "Outside slice" },
];

function ChartSliceLabelsControls(props) {
  const dispatch = useAppDispatch();
  const handleSliceScaleTypeChange = (sliceLabels) => {
    dispatch(update(props.chartId, "sliceLabels", sliceLabels));
  };
  const handleMinSliceCountChange = (minSliceCount) => {
    dispatch(update(props.chartId, "minSliceCount", minSliceCount));
  };
  const sliceLabels = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).sliceLabels
  );
  const minSliceCount = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).minSliceCount
  );
  const hasLabels = (sliceLabels !== nullValue);
  return (
    <UiControlsMenu
      title="Slice labels"
      summary="Labels"
      className="mr-chart-controls-menu"
      // onClear={hasLabels && (() => handleSliceScaleTypeChange(nullValue))}
    >
      <UiRadioList
        items={options}
        onChange={handleSliceScaleTypeChange}
        value={sliceLabels ?? "outside"}
      />

      {
        hasLabels && (
          <React.Fragment>
            <hr />

            <UiToggleSlider
              label="Min slice count"
              onCheckedChange={(checked) => handleMinSliceCountChange(checked ? 1 : 0)}
              checked={minSliceCount > 0}
              max={500}
              min={1}
              onChange={handleMinSliceCountChange}
              // unit={minSliceCount === 1 ? " entry" : " entries"}
              value={minSliceCount}
            />

          </React.Fragment>
        )
      }
    </UiControlsMenu>
  );
}

ChartSliceLabelsControls.propTypes = {
  chartId: PropTypes.string.isRequired,
};

export default ChartSliceLabelsControls;
