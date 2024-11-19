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

      const visibleColumns = new Set();

      if (props.hideUnmatched || props.filteredIds) {
        for (const col of props.matrixData.columns) {
          if (props.activeIdsSet.has(col.name)) {
            visibleColumns.add(col.name);
          }
        }
      }
      else {
        for (const col of props.matrixData.columns) {
          if (col.name !== "0" && col.name !== "--mr-index") {
            visibleColumns.add(col.name);
          }
        }
      }

      for (const row of props.matrixData.rows) {
        const rowId = row[props.matrixData.columns[0].name];
        if (visibleColumns.has(rowId)) {
          for (const column of visibleColumns.keys()) {
            data.push({
              col: column,
              row: rowId,
              value: row[column],
            });
            if (row[column] > max) {
              max = row[column];
            }
            if (row[column] < min) {
              min = row[column];
            }
          }
        }
      }

      data.size = visibleColumns.size;

      return { table: data };
    },
    [ props.activeIdsSet, props.matrixData, props.hideUnmatched, props.filteredIds ]
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
  filteredIds: PropTypes.instanceOf(Set).isRequired,
  height: PropTypes.number.isRequired,
  hideUnmatched: PropTypes.bool,
  labelsFontSize: PropTypes.number,
  labelsUnit: PropTypes.string,
  matrixData: PropTypes.object,
  matrixId: PropTypes.string.isRequired,
  rotateAxisLabels: PropTypes.number,
  showLabels: PropTypes.bool,
  width: PropTypes.number.isRequired,
};

export default MatrixVegaChart;
