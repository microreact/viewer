import PropTypes from "prop-types";
import React from "react";

import UiControlsMenu from "./UiControlsMenu.react.js";
import UiRadioList from "./UiRadioList.react.js";
import UiFloatingFilter from "./UiFloatingFilter.react.js";

import { update } from "../actions/charts.js";

import chartStateSelector from "../selectors/charts/chart-state.js";

import { useAppDispatch, usePresentSelector } from "../utils/hooks.js";
import UiSelectList from "./UiSelectList.react.js";
import activeRowsSelector from "../selectors/filters/active-rows.js";
import { emptyArray } from "../constants.js";
import { sortComparator } from "../utils/arrays.js";

const options = [
  { value: "all", label: "All values" },
  { value: "non-null", label: "All values except blanks" },
  { value: "custom", label: "Custom values" },
];

const defaultValueType = "all";

function ChartCountableValuesMenu(props) {
  const dispatch = useAppDispatch();

  const handleValueTypeChange = (valueType) => {
    dispatch(update(props.chartId, "valueType", valueType));
  };

  const handleIncludedValuesChange = (includedValues) => {
    dispatch(update(props.chartId, "includedValues", includedValues));
  };

  const activeRows = usePresentSelector(activeRowsSelector);

  const seriesFields = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).seriesFields ?? emptyArray
  );

  const includedValues = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).includedValues
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
      active={includedValues?.length > 0}
    >
      <UiRadioList
        items={options}
        onChange={handleValueTypeChange}
        value={valueType ?? defaultValueType}
      />

      {
        (valueType === "custom") && (
          <React.Fragment>
            <hr />

            <UiFloatingFilter
              items={seriesValues}
              label="Search values"
              renderItems={
                (items) => (
                  <UiSelectList
                    items={items}
                    onChange={handleIncludedValuesChange}
                    style={
                      {
                        height: 48 + items.length * 28,
                        minHeight: "64px",
                        maxHeight: "calc(100vh - 320px)",
                      }
                    }
                    value={includedValues}
                    valueProperty="value"
                  />
                )
              }
            />
          </React.Fragment>
        )
      }

    </UiControlsMenu>
  );
}

ChartCountableValuesMenu.propTypes = {
  chartId: PropTypes.string.isRequired,
};

export default ChartCountableValuesMenu;
