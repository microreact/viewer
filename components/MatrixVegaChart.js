import PropTypes from "prop-types";
import React from "react";

import { convertChartSpec } from "../utils/charts.js";

import VegaChart from "./VegaChart.js";

function MatrixVegaChart(props) {
  const chartData = React.useMemo(
    () => {
      let min = Number.MAX_SAFE_INTEGER;
      let max = Number.MIN_SAFE_INTEGER;
      const data = [];
      const activeColumns = props.matrixData.columns.filter((x) => props.activeIdsSet.has(x.name));

      const ids = new Set();

      for (let yIndex = 0; yIndex < props.matrixData.rows.length; yIndex++) {
        const row = props.matrixData.rows[yIndex];
        const rowId = row[props.matrixData.columns[0].name];
        if (props.activeIdsSet.has(rowId)) {
          for (let xIndex = 0; xIndex < activeColumns.length; xIndex++) {
            const column = activeColumns[xIndex];
            ids.add(rowId);
            data.push({
              col: column.name,
              row: rowId,
              value: row[column.name],
            });
            if (row[column.name] > max) {
              max = row[column.name];
            }
            if (row[column.name] < min) {
              min = row[column.name];
            }
          }
        }
      }

      data.size = ids.size;

      return { table: data };
    },
    [ props.activeIdsSet, props.matrixData ]
  );

  const chartSpec = React.useMemo(
    () => {
      const vlSpec = {
        "width": "auto",
        "height": "auto",
        "bounds": "full",
        "autosize": {
          type: "fit",
          contains: "padding",
        },
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": { "url": "data/cars.json" },
        "encoding": {
          "y": {
            "field": "row",
            "type": "nominal",
            "axis": {
              "labelFontSize": props.axisLabelsFontSize,
            },
          },
          "x": {
            "field": "col",
            "type": "nominal",
            "axis": {
              "labelAngle": -props.rotateAxisLabels,
              "orient": "top",
              "labelFontSize": props.axisLabelsFontSize,
            },
          },
        },
        "config": {
          "axis": {
            "labelOverlap": "greedy",
            "ticks": false,
            "title": false,
          },
          "view": {
            "stroke": "transparent",
          },
        },
        "layer": [
          {
            "mark": {
              "type": "rect",
              "tooltip": true,
            },
            "encoding": {
              "color": {
                "field": "value",
                "type": "quantitative",
                "scale": {
                  "scheme": "tealblues",
                  "type": "linear",
                },
                "legend": {
                  "title": "",
                },
              },
            },
          },
        ],
      };
      if (props.showLabels) {
        vlSpec.layer.push({
          "mark": {
            "type": "text",
            "tooltip": true,
            "fontSize": props.labelsFontSize,
            "limit": props.width / chartData.table.size,
          },
          "encoding": {
            "text": { "field": "value", "type": "quantitative" },
            // "color": {
            //   "condition": { "test": "datum['num_cars'] < 40", "value": "black" },
            //   "value": "white",
            // },
          },
        });
      }
      return convertChartSpec(
        vlSpec,
        props.width,
        props.height,
      );
    },
    [props.rotateAxisLabels, props.axisLabelsFontSize, props.showLabels, props.width, props.height, props.labelsFontSize, chartData.table.size],
  );

  return (
    <VegaChart
      data={chartData}
      spec={chartSpec}
      chartRef={props.chartRef}
    />
  );
}

MatrixVegaChart.propTypes = {
  activeIdsSet: PropTypes.instanceOf(Set).isRequired,
  axisLabelsFontSize: PropTypes.number,
  chartRef: PropTypes.object,
  className: PropTypes.string,
  height: PropTypes.number.isRequired,
  labelsFontSize: PropTypes.number,
  labelsUnit: PropTypes.string,
  matrixData: PropTypes.object,
  matrixId: PropTypes.string.isRequired,
  rotateAxisLabels: PropTypes.number,
  showLabels: PropTypes.bool,
  truncateLabels: PropTypes.bool,
  width: PropTypes.number.isRequired,
};

export default MatrixVegaChart;
