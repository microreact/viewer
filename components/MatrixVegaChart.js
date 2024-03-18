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

      for (let yIndex = 0; yIndex < props.matrixData.rows.length; yIndex++) {
        const row = props.matrixData.rows[yIndex];
        const rowId = row[props.matrixData.columns[0].name];
        if (props.activeIdsSet.has(rowId)) {
          for (let xIndex = 0; xIndex < activeColumns.length; xIndex++) {
            const column = activeColumns[xIndex];
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
            "field": "row", "type": "nominal",
          },
          "x": {
            "field": "col",
            "type": "nominal",
            "axis": {
              "labelAngle": -props.rotateAxisLabels,
              "orient": "top",
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
                  "scheme": "goldred",
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
            "limit": props.width / props.activeIdsSet.size,
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
    [ props.width, props.height, props.rotateAxisLabels, props.labelsFontSize, props.activeIdsSet, props.showLabels ],
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
  chartRef: PropTypes.object,
};

export default MatrixVegaChart;
