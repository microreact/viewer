import PropTypes from "prop-types";
import React from "react";

import UiControlsMenu from "./UiControlsMenu.react.js";
import UiRadioList from "./UiRadioList.react.js";

import { update } from "../actions/charts.js";

import chartStateSelector from "../selectors/charts/chart-state.js";

import { useAppDispatch, usePresentSelector } from "../utils/hooks.js";
import UiSelectList from "./UiSelectList.react.js";
import activeRowsSelector from "../selectors/filters/active-rows.js";
import { emptyArray } from "../constants.js";
import { sortComparator } from "../utils/arrays.js";

const options = [
  { value: "off", label: "Off" },
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

  const seriesValues = React.useMemo(
    () => {
      const valuesSet = new Set();

      for (const row of activeRows) {
        for (const fieldName of seriesFields) {
          valuesSet.add(row[fieldName]);
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
    [ activeRows, seriesFields ],
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

      <hr />

      <UiSelectList
        disableSelectAll
        items={seriesValues}
        onChange={handleCountableValuesChange}
        style={
          {
            height: 8 + seriesValues.length * 28,
            maxHeight: "calc(100vh - 240px)",
          }
        }
        value={countableValues}
        valueProperty="value"
      />

    </UiControlsMenu>
  );
}

ChartCountableValuesMenu.propTypes = {
  chartId: PropTypes.string.isRequired,
};

export default ChartCountableValuesMenu;
