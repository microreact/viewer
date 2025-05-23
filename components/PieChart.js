import PropTypes from "prop-types";
import React from "react";
import ReactECharts from "echarts-for-react";

import { calculatePercentage } from "../utils/number.js";

function PieChart(props) {
  const colourMap = React.useMemo(
    () => {
      const map = new Map();

      for (const [key, value] of props.colourMap.entries()) {
        map.set(key?.toString?.(), value);
      }
      return map;
    },
    [props.colourMap]
  );

  const groupedData = React.useMemo(
    () => {
      const minSliceCount = props.minSliceCount ?? 0;
      const counts = {};
      let total = 0;

      for (const row of props.activeRows) {
        const value = row[props.categoriesField] ?? "";
        if (!props.excludeNullValues || !!value) {
          counts[value] = (counts[value] ?? 0) + 1;
          total += 1;
        }
      }

      const data = [];

      for (const [category, count] of Object.entries(counts)) {
        const hasLabel = (props.sliceLabels !== "off") && (count > minSliceCount) && category;
        data.push({
          "name": (
            props.showPercentages
              ?
              `${category} (${calculatePercentage(count, total)}%)`
              :
              category
          ),
          "value": count,
          "itemStyle": {
            "color": colourMap.get(category),
          },
          "label": {
            "show": hasLabel,
            "position": props.sliceLabels,
          },
          "labelLine": {
            "show": hasLabel,
          },
        });
      }

      data.total = total;

      return data;
    },
    [ props.activeRows, colourMap, props.minSliceCount, props.sliceLabels, props.excludeNullValues, props.showPercentages ],
  );

  if (groupedData.length > 5000) {
    return (
      <div className="mr-chart-message">
        <p>Too Many Categories</p>
        <p>The column <code>{props.categoriesField}</code> includes more than 5000 unique values.</p>
      </div>
    );
  }

  const options = {
    "animation": false,
    "grid": {
      "top": 32,
      "bottom": 16,
      "left": 16,
      "right": 16,
    },
    // toolbox: {
    //   show: true,
    //   feature: {
    //     mark: { show: true },
    //     dataView: { show: true, readOnly: false },
    //     restore: { show: true },
    //     saveAsImage: { show: true },
    //   },
    // },
    "tooltip": {
      "trigger": "item",
      "position": "top",
      "formatter": (params) => {
        const { name, value } = params.data;
        return `
          ${props.categoriesField}: <strong>${name}</strong>
          <br />
          Number of entries: <strong>${value}</strong> of <strong>${groupedData.total}
          (${calculatePercentage(value, groupedData.total)}%)
        `;
      },
      "appendToBody": true,
    },
    "series": [
      {
        // radius: [0, 100],
        "name": props.categoriesField,
        "type": "pie",
        "data": groupedData,
        "roseType": props.sliceScaleType,
        "itemStyle": {
          "shadowBlur": 0.1,
          "shadowColor": "rgba(0, 0, 0, 0.28)",
        },
        "emphasis": {
          "itemStyle": {
            "shadowBlur": 10,
            "shadowOffsetX": 0,
            "shadowColor": "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  const handleChartClick = (params) => {
    if (params.componentSubType === "pie" && params.componentType === "series") {
      const value = params.data.name;
      props.onClick(null, [ params.event.event, { [props.categoriesField]: value } ]);
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

PieChart.propTypes = {
  activeRows: PropTypes.array,
  categoriesField: PropTypes.string,
  chartId: PropTypes.string.isRequired,
  className: PropTypes.string,
  colourMap: PropTypes.instanceOf(Map),
  excludeNullValues: PropTypes.bool,
  height: PropTypes.number.isRequired,
  minSliceCount: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  sliceLabels: PropTypes.bool,
  showPercentages: PropTypes.bool,
  sliceScaleType: PropTypes.string,
  width: PropTypes.number.isRequired,
};

export default PieChart;
