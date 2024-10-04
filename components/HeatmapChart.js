import PropTypes from "prop-types";
import React from "react";
import ReactECharts from "echarts-for-react";

import { useChartStateSelector, usePresentSelector } from "../utils/hooks.js";
import activeRowsSelector from "../selectors/filters/active-rows.js";
import configSelector from "../selectors/config.js";
import { measureWidth } from "../utils/text.js";
import chartStateSelector from "../selectors/charts/chart-state.js";

const labelFontSize = 11;

function normaliseValue(value, whole) {
  return parseFloat((value / whole * 100).toFixed(2));
}

function HeatmapChart(props) {
  const config = usePresentSelector(configSelector);

  const activeRows = usePresentSelector(activeRowsSelector);

  const countableValues = useChartStateSelector(
    (chartState) => chartState.countableValues,
    props.chartId,
  );

  const seriesFields = useChartStateSelector(
    (chartState) => chartState.seriesFields,
    props.chartId,
  );

  const categoriesField = useChartStateSelector(
    (chartState) => chartState.categoriesField,
    props.chartId,
  );

  const excludeNullValues = useChartStateSelector(
    (chartState) => chartState.excludeNullValues,
    props.chartId,
  );

  const valueType = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).valueType
  );

  const labelsWidth = React.useMemo(
    () => {
      let longestLabel = "";

      for (const fieldName of seriesFields) {
        if (fieldName.length > longestLabel.length) {
          longestLabel = fieldName;
        }
      }

      return measureWidth(longestLabel, labelFontSize) + 8;
    },
    [ config, seriesFields ],
  );

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

      const counts = {};

      for (const row of activeRows) {
        for (const fieldName of seriesFields) {
          const category = row[categoriesField] ?? "";
          const value = row[fieldName] ?? "";
          if (!countableValues || countableValues.length === 0 || countableValues.includes(value)) {
            const key = `${category} - ${fieldName}`;
            counts[key] = (counts[key] ?? 0) + 1;
          }
        }
      }

      const data = [];
      const categories = Array.from(categoriesSet);

      let minValue = Number.MAX_SAFE_INTEGER;
      let maxValue = Number.MIN_SAFE_INTEGER;

      for (let xIndex = 0; xIndex < categories.length; xIndex++) {
        const category = categories[xIndex];
        for (let yIndex = 0; yIndex < seriesFields.length; yIndex++) {
          const fieldName = seriesFields[yIndex];
          const key = `${category} - ${fieldName}`;
          const value = counts[key];
          // const value = (
          //   isNormalised
          //     ?
          //     parseFloat((counts[key] / activeRows.length * 100).toFixed(2))
          //     :
          //     counts[key]
          // );
          data.push([
            xIndex,
            yIndex,
            (key in counts) ? value : "-",
          ]);
          if (value < minValue) {
            minValue = value;
          }
          if (value > maxValue) {
            maxValue = value;
          }
        }
      }

      return {
        seriesData: data,
        categories,
        range: [ minValue, maxValue ],
      };
    },
    [ activeRows, categoriesField, seriesFields, countableValues, isNormalised, excludeNullValues ],
  );

  if (chartData.series > 5000) {
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
      "left": labelsWidth,
      "right": 32,
      "top": 56,
      "bottom": 32,
    },
    "tooltip": {
      "trigger": "item",
      "position": "top",
      // "formatter": "{b0}: {a0}<br />Number of entries: {c0}",
      "formatter": (params) => {
        return `${categoriesField}: <strong>${params.name}</strong><br />${seriesFields[params.value[1]]}: <strong>${params.value[2]}</strong> of <strong>${activeRows.length}</strong> (${normaliseValue(params.value[2], activeRows.length)}%)`;
      },
      "appendToBody": true,
    },
    "series": {
      "type": "heatmap",
      "data": chartData.seriesData,
      "label": {
        "show": true,
        "formatter": (params) => {
          return isNormalised ? `${normaliseValue(params.data[2], activeRows.length)}%` : params.data[2];
        },
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
    },
    "yAxis": {
      "type": "category",
      "data": seriesFields,
      "axisLabel": {
        // show: true,
        position: "top",
        fontFamily: config.theme.fonts.body,
        fontSize: labelFontSize,
        // formatter(d) {
        //   return `${d.name} ${d.data}`;
        // },
      },
    },
    "visualMap": {
      "min": chartData.range[0],
      "max": chartData.range[1],
      "calculable": true,
      "orient": "horizontal",
      "right": "center",
      "top": 0,
      "formatter": (value) => {
        // return "0";
        return isNormalised ? `${normaliseValue(value, activeRows.length)}%` : value;
      },
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
