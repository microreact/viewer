import PropTypes from "prop-types";
import React from "react";
import ReactECharts from "echarts-for-react";

import { update } from "../actions/charts.js";

import { useAppDispatch, useChartStateSelector, usePresentSelector } from "../utils/hooks.js";
import activeRowsSelector from "../selectors/filters/active-rows.js";
import UiSelect from "./UiSelect.react.js";
import { emptyArray } from "../constants.js";
import { calculatePercentage } from "../utils/number.js";
import { createCombinedStateSelector } from "../utils/state.js";
import colourMapForFieldSelector from "../selectors/styles/colour-map-for-field.js";
import configSelector from "../selectors/config.js";

function MultiVariableBarChart(props) {
  const dispatch = useAppDispatch();

  const handleFilterFieldChange = (filterField) => {
    dispatch(update(props.chartId, "filterField", filterField));
  };

  const config = usePresentSelector(configSelector);

  const activeRows = usePresentSelector(activeRowsSelector);

  const controls = useChartStateSelector(
    (chartState) => chartState.controls,
    props.chartId,
  );

  const seriesFields = useChartStateSelector(
    (chartState) => chartState.seriesFields,
    props.chartId,
  );

  const valueType = useChartStateSelector(
    (chartState) => chartState.valueType,
    props.chartId,
  );

  const includedValues = useChartStateSelector(
    (chartState) => chartState.includedValues ?? emptyArray,
    props.chartId,
  );

  const filterField = useChartStateSelector(
    (chartState) => chartState.filterField,
    props.chartId,
  );

  const colourMapsSelector = React.useMemo(
    () => createCombinedStateSelector(
      () => seriesFields ?? emptyArray,
      (state, field) => colourMapForFieldSelector(state, field),
      (colourMaps) => {
        const combinedColourMap = new Map();
        for (const colourMap of colourMaps) {
          for (const [value, colour] of colourMap.entries()) {
            combinedColourMap.set(value, colour);
          }
        }
        return combinedColourMap;
      },
    ),
    [seriesFields],
  );

  const combinedColourMap = usePresentSelector(colourMapsSelector);

  const chartData = React.useMemo(
    () => {
      const uniqueValues = new Set();

      const series = [];

      const activeSeriesFields = (filterField && filterField !== " ") ? [ filterField ] : seriesFields;

      if (activeSeriesFields?.length > 0) {
        for (const row of activeRows) {
          for (const fieldName of activeSeriesFields) {
            const value = row[fieldName] ?? "";
            const valueIncluded = (
              (!valueType || valueType === "all")
              ||
              (valueType === "non-null" && ((value ?? undefined) || undefined) !== undefined)
              ||
              (valueType === "custom" && includedValues.includes(value))
            );
            if (valueIncluded) {
              uniqueValues.add(value);
            }
          }
        }

        const counts = {};

        for (const row of activeRows) {
          for (const fieldName of activeSeriesFields) {
            const value = row[fieldName] ?? "";
            const key = `${fieldName} - ${value}`;
            counts[key] = (counts[key] ?? 0) + 1;
          }
        }

        for (const value of uniqueValues.keys()) {
          const data = [];
          for (const fieldName of activeSeriesFields) {
            const key = `${fieldName} - ${value}`;
            data.push(counts[key] || "-");
          }
          series.push({
            "data": data,
            "name": value,
            "stack": "a",
            "type": "bar",
            "itemStyle": {
              "color": combinedColourMap.get(value),
            },
          });
        }
      }

      return series;
    },
    [ activeRows, seriesFields, filterField, valueType, includedValues, combinedColourMap ],
  );

  if (chartData.length > 500) {
    return (
      <div className="mr-chart-message">
        <p>Too Many variables selected</p>
      </div>
    );
  }

  const categories = (filterField && filterField !== " ") ? [ filterField ] : seriesFields;

  if ((seriesFields?.length ?? 0) === 0) {
    return null;
  }

  const options = {
    "animation": false,
    "grid": {
      "top": 80,
      "bottom": 32,
      "left": 64,
      "right": 32,
    },
    "tooltip": {
      "trigger": "item",
      "position": "top",
      "formatter": (params) => {
        return `
          ${params.name}: <strong>${params.seriesName}</strong>
          <br />
          Number of entries: 
          <strong>${params.value}</strong> 
          of 
          <strong>${activeRows.length}</strong> 
          (${calculatePercentage(params.value, activeRows.length)}%)
          `;
      },
      "appendToBody": true,
    },
    "series": chartData,
    "xAxis": {
      "type": "category",
      "data": categories,
      "axisLabel": {
        "interval": 0,
        "hideOverlap": true,
        "overflow": "truncate",
        "width": (props.width - 64 - 32) / (categories?.length ?? 1),
        "fontFamily": config.theme.fonts.body,
      },
    },
    "yAxis": {
      "type": "value",
    },
    "legend": {
      "show": true,
      "type": "scroll",
      "top": 40,
      "left": 24,
      "right": 24,
    },
  };

  const handleChartClick = (params) => {
    if (params.componentSubType === "bar" && params.componentType === "series") {
      props.onClick(null, [ params.event.event, { [params.name]: params.seriesName } ]);
    }
  };

  return (
    <React.Fragment>
      {
        !controls && (
          <UiSelect
            nullValue=" "
            nullLabel="ALL COLUMNS"
            onChange={handleFilterFieldChange}
            options={seriesFields}
            value={filterField ?? " "}
            className="mr-chart-field-filter"
            size="small"
          />
        )
      }
      <ReactECharts
        style={{ width: props.width, height: props.height }}
        option={options}
        onEvents={
          { "click": handleChartClick }
        }
      />
    </React.Fragment>
  );
}

MultiVariableBarChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default MultiVariableBarChart;
