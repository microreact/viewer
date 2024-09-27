import PropTypes from "prop-types";
import React from "react";
import ReactECharts from "echarts-for-react";

import { update } from "../actions/charts.js";

import { useAppDispatch, useChartStateSelector, usePresentSelector } from "../utils/hooks.js";
import activeRowsSelector from "../selectors/filters/active-rows.js";
import UiSelect from "./UiSelect.react.js";

function MultiVariableBarChart(props) {
  const dispatch = useAppDispatch();

  const handleFilterFieldChange = (filterField) => {
    dispatch(update(props.chartId, "filterField", filterField));
  };

  const activeRows = usePresentSelector(activeRowsSelector);

  const controls = useChartStateSelector(
    (chartState) => chartState.controls,
    props.chartId,
  );

  const seriesFields = useChartStateSelector(
    (chartState) => chartState.seriesFields,
    props.chartId,
  );

  const excludeNullValues = useChartStateSelector(
    (chartState) => chartState.excludeNullValues,
    props.chartId,
  );

  const filterField = useChartStateSelector(
    (chartState) => chartState.filterField,
    props.chartId,
  );

  const chartData = React.useMemo(
    () => {
      const uniqueValues = new Set();

      const activeSeriesFields = (filterField && filterField !== " ") ? [ filterField ] : seriesFields;

      for (const row of activeRows) {
        for (const fieldName of activeSeriesFields) {
          const value = row[fieldName] ?? "";
          if (!excludeNullValues || !!value) {
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

      const series = [];

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
        });
      }

      return series;
    },
    [ activeRows, seriesFields, filterField, excludeNullValues ],
  );

  if (chartData.length > 5000) {
    return (
      <div className="mr-chart-message">
        <p>Too Many Categories</p>
        <p>The column <code>{categoriesField}</code> includes more than 5000 unique values.</p>
      </div>
    );
  }

  const options = {
    "animation": false,
    "grid": {
      "top": 64,
      "bottom": 32,
      "left": 64,
      "right": 16,
    },
    "tooltip": {
      "trigger": "item",
      "position": "top",
      "formatter": "{b0}: {a0}<br />Number of entries: {c0}",
      "appendToBody": true,
    },
    "series": chartData,
    "xAxis": {
      "type": "category",
      "data": (filterField && filterField !== " ") ? [ filterField ] : seriesFields,
    },
    "yAxis": {
      "type": "value",
    },
    "legend": {
      "show": true,
      "type": "scroll",
      "top": 24,
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
            value={filterField}
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
