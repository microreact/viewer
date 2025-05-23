import PropTypes from "prop-types";
import React from "react";

import UiControlsMenu from "./UiControlsMenu.react.js";
import UiRadioList from "./UiRadioList.react.js";
import UiSelectList from "./UiSelectList.react.js";
import UiSlider from "./UiSlider.react.js";
import UiToggleSwitch from "./UiToggleSwitch.react.js";
import UiFloatingFilter from "./UiFloatingFilter.react.js";

import { update } from "../actions/charts.js";
import chartStateSelector from "../selectors/charts/chart-state.js";
import { useAppDispatch, usePresentSelector } from "../utils/hooks.js";
import activeRowsSelector from "../selectors/filters/active-rows.js";
import { emptyArray } from "../constants.js";
import { sortComparator } from "../utils/arrays.js";
import { isBlankValue } from "../utils/text.js";

const options = [
  { value: "count", label: "Count" },
  { value: "percentage", label: "Percentage" },
];

const defaultValueType = "count";

function ChartCountableValuesMenu(props) {
  const dispatch = useAppDispatch();

  const handleValueTypeChange = (valueType) => {
    dispatch(update(props.chartId, "valueType", valueType));
  };

  const handleCountableValuesChange = (countableValues) => {
    dispatch(update(props.chartId, "countableValues", countableValues));
  };

  const handleHideNullValuesChange = (excludeNullValues = undefined) => {
    dispatch(update(props.chartId, "excludeNullValues", excludeNullValues));
  };

  const handleRoundingDigitsChange = (roundingDigits) => {
    dispatch(update(props.chartId, "roundingDigits", roundingDigits));
  };

  const handleHideLabelsChange = (hideLabels) => {
    dispatch(update(props.chartId, "hideLabels", hideLabels));
  };

  const handleXAxisLabelRotateChange = (xAxisLabelRotate) => {
    dispatch(update(props.chartId, "xAxisLabelRotate", xAxisLabelRotate));
  };

  const activeRows = usePresentSelector(activeRowsSelector);

  const seriesFields = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).seriesFields ?? emptyArray
  );

  const countableValues = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).countableValues
  );

  const valueType = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).valueType
  );

  const excludeNullValues = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).excludeNullValues
  );

  const roundingDigits = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).roundingDigits
  );

  const hideLabels = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).hideLabels
  );

  const xAxisLabelRotate = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).xAxisLabelRotate
  );

  const seriesValues = React.useMemo(
    () => {
      const valuesSet = new Set();

      for (const row of activeRows) {
        for (const fieldName of seriesFields) {
          if (!excludeNullValues || !isBlankValue(row[fieldName])) {
            valuesSet.add(row[fieldName]);
          }
        }
      }

      const items = [];

      for (const value of valuesSet.keys()) {
        items.push({
          label: value ?? "(blank)",
          value,
        });
      }

      items.sort(sortComparator("label"));

      return items;
    },
    [ activeRows, seriesFields, excludeNullValues ],
  );

  return (
    <UiControlsMenu
      title="Values"
      className="mr-chart-controls-menu"
      active={countableValues?.length > 0}
    >
      <UiRadioList
        items={options}
        onChange={handleValueTypeChange}
        value={valueType ?? defaultValueType}
      />

      {
        (valueType === "percentage") && (
          <UiSlider
            label="Rounding digits"
            max={12}
            min={0}
            onChange={handleRoundingDigitsChange}
            value={roundingDigits ?? 0}
          />
        )
      }

      <hr />

      <UiToggleSwitch
        label="Hide labels"
        onChange={handleHideLabelsChange}
        value={hideLabels}
      />

      <UiToggleSwitch
        label="Exclude blank values"
        onChange={handleHideNullValuesChange}
        value={excludeNullValues}
      />

      <UiSlider
        label="Rotate x-axis labels"
        max={90}
        min={0}
        step={45}
        unit="°"
        onChange={handleXAxisLabelRotateChange}
        value={xAxisLabelRotate ?? 0}
      />

      <hr />

      <UiFloatingFilter
        items={seriesValues}
        label="Search values"
        renderItems={
          (items) => (
            <UiSelectList
              items={items}
              onChange={handleCountableValuesChange}
              style={
                {
                  height: 40 + items.length * 28,
                  minHeight: "64px",
                  maxHeight: "calc(100vh - 472px)",
                }
              }
              value={countableValues}
              valueProperty="value"
            />
          )
        }
        valueGetter={(x) => (x.value ?? "").toString().toLowerCase()}
      />

    </UiControlsMenu>
  );
}

ChartCountableValuesMenu.propTypes = {
  chartId: PropTypes.string.isRequired,
};

export default ChartCountableValuesMenu;
