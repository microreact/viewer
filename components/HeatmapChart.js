import PropTypes from "prop-types";
import React from "react";
import ReactECharts from "echarts-for-react";

import { useChartStateSelector, usePresentSelector } from "../utils/hooks.js";
import activeRowsSelector from "../selectors/filters/active-rows.js";
import configSelector from "../selectors/config.js";
import { isBlankValue, measureWidth } from "../utils/text.js";
import { calculatePercentage, toFixedDigits } from "../utils/number.js";
import chartStateSelector from "../selectors/charts/chart-state.js";
import { emptyArray } from "../constants.js";
import { colourRanges } from "../utils/colours";
import { sortComparator } from "../utils/arrays.js";
import dataColumnsByFieldMapSelector from "../selectors/datasets/data-columns-by-field-map.js";

const labelFontSize = 11;

const defaultColourRange = "microreact teal-2";

function HeatmapChart(props) {
  const config = usePresentSelector(configSelector);

  const activeRows = usePresentSelector(activeRowsSelector);

  const dataColumnsByFieldMap = usePresentSelector(dataColumnsByFieldMapSelector);

  const countableValues = useChartStateSelector(
    (chartState) => chartState.countableValues,
    props.chartId,
  );

  const rawSeriesFields = useChartStateSelector(
    (chartState) => chartState.seriesFields ?? emptyArray,
    props.chartId,
  );

  const seriesFields = React.useMemo(
    () => {
      const fields = [];

      for (const field of rawSeriesFields) {
        if (dataColumnsByFieldMap.get(field)) {
          fields.push(field);
        }
      }

      return fields;
    },
    [rawSeriesFields],
  );

  const categoriesField = useChartStateSelector(
    (chartState) => chartState.categoriesField,
    props.chartId,
  );

  const excludeNullValues = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).excludeNullValues
  );

  const valueType = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).valueType
  );

  const roundingDigits = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).roundingDigits
  );

  const hideLabels = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).hideLabels
  );

  const colourScheme = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).colourScheme ?? defaultColourRange
  );

  const colourRange = colourRanges.find((x) => x.name === colourScheme)?.entries;

  const labelsWidth = React.useMemo(
    () => {
      let longestLabel = "";

      for (const fieldName of seriesFields) {
        if (fieldName.length > longestLabel.length) {
          longestLabel = fieldName;
        }
      }

      return measureWidth(longestLabel, labelFontSize) + 12;
    },
    [seriesFields],
  );

  const showLabels = !hideLabels;
  const isNormalised = (valueType === "percentage");

  const chartData = React.useMemo(
    () => {
      const categoriesSet = new Set();

      for (const row of activeRows) {
        const category = row[categoriesField] ?? "";
        if (!excludeNullValues || !!category) {
          categoriesSet.add(category);
        }
      }
      const categories = Array.from(categoriesSet);
      categories.sort(sortComparator());
      const counts = {};
      const allCounts = {};

      for (const row of activeRows) {
        for (const fieldName of seriesFields) {
          const category = row[categoriesField] ?? "";
          const key = `${category} - ${fieldName}`;
          const value = row[fieldName] ?? "";
          if (!excludeNullValues || !isBlankValue(value)) {
            if (!countableValues || countableValues.length === 0 || countableValues.includes(value)) {
              counts[key] = (counts[key] ?? 0) + 1;
            }

            allCounts[key] = (allCounts[key] ?? 0) + 1;
          }
        }
      }

      const data = [];

      let minValue = Number.MAX_SAFE_INTEGER;
      let maxValue = Number.MIN_SAFE_INTEGER;

      for (let xIndex = 0; xIndex < categories.length; xIndex++) {
        const category = categories[xIndex];
        for (let yIndex = 0; yIndex < seriesFields.length; yIndex++) {
          const fieldName = seriesFields[yIndex];
          const key = `${category} - ${fieldName}`;
          if (key in counts) {
            const measure = (
              isNormalised
                ?
                calculatePercentage(
                  counts[key],
                  allCounts[key],
                  roundingDigits,
                )
                :
                counts[key]
            );
            data.push([
              xIndex,
              yIndex,
              measure,
              counts[key],
              allCounts[key],
            ]);
            if (measure < minValue) {
              minValue = measure;
            }
            if (measure > maxValue) {
              maxValue = measure;
            }
          }
          else {
            data.push([
              xIndex,
              yIndex,
              "-",
            ]);
          }
        }
      }

      return {
        seriesData: data,
        categories,
        range: [ minValue, maxValue ],
      };
    },
    [activeRows, categoriesField, seriesFields, countableValues, excludeNullValues, roundingDigits, isNormalised],
  );

  if (chartData.series > 5000) {
    return (
      <div className="mr-chart-message">
        <p>Too Many Categories</p>
        <p>The column <code>{categoriesField}</code> includes more than 5000 unique values.</p>
      </div>
    );
  }

  if (seriesFields.length === 0 || !categoriesField) {
    return null;
  }

  const grid = {
    "left": labelsWidth,
    "right": 32,
    "top": 56,
    "bottom": 32,
  };

  const options = {
    "textStyle": {
      "fontFamily": config.theme.fonts.body,
    },
    "animation": false,
    "grid": grid,
    "tooltip": {
      "trigger": "item",
      "position": "top",
      "formatter": (params) => {
        return `
          ${categoriesField}:
            <strong>${params.name}</strong>
          <br />
          ${seriesFields[params.value[1]]}:
            <strong>${params.value[3]}</strong>
            of
            <strong>${params.value[4]}</strong> 
            (${calculatePercentage(params.value[3], params.value[4], roundingDigits)}%)
          `;
      },
      "appendToBody": true,
    },
    "series": {
      "type": "heatmap",
      "data": chartData.seriesData,
      "label": {
        "show": showLabels,
        "formatter": (params) => {
          return (
            isNormalised
              ?
              `${params.data[2]}%`
              :
              params.data[2]
          );
        },
        "fontWeight": "bold",
      },
      "emphasis": {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
    "xAxis": {
      "type": "category",
      "data": chartData.categories,

      "axisLabel": {
        "interval": 0,
        "hideOverlap": true,
        "overflow": "truncate",
        "width": (props.width - grid.left - grid.right) / (chartData.categories?.length ?? 1) - 2,
        "fontFamily": config.theme.fonts.body,
      },
    },
    "yAxis": {
      "type": "category",
      "data": seriesFields,
      "axisLabel": {
        "position": "top",
        "fontSize": labelFontSize,
      },
    },
    "visualMap": {
      "dimension": 2,
      "min": chartData.range[0],
      "max": chartData.range[1],
      "calculable": true,
      "orient": "horizontal",
      "right": "center",
      "top": 0,
      "formatter": (value) => {
        return isNormalised ? `${toFixedDigits(value)}%` : toFixedDigits(value, 0);
      },
      "inRange": { "color": colourRange },
    },
  };

  const handleChartClick = (params) => {
    if (params.componentSubType === "bar" && params.componentType === "series") {
      props.onClick(null, [ params.event.event, { [params.name]: params.seriesName } ]);
    }
  };

  return (
    <ReactECharts
      style={{ width: props.width, height: props.height }}
      option={options}
      onEvents={
        { "click": handleChartClick }
      }
    />
  );
}

HeatmapChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default HeatmapChart;
