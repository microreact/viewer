import PropTypes from "prop-types";
import React from "react";
import { Handler } from "vega-tooltip";
import { Vega } from "react-vega";
// import debounce from "lodash.debounce";

// import "../styles/chart-pane.css";
import { createSelector } from "reselect";
import ChartControls from "../containers/ChartControls.react";
import { ChartTypes } from "../utils/prop-types";
import { exportPNG, exportSVG, isVegaLiteSpec, vegaLiteToVega, convertChartSpec } from "../utils/charts";
import { downloadDataUrl } from "../utils/downloads";

class ChartDefaultEmbed extends React.PureComponent {

  defaultSpecSelector = createSelector(
    (props) => props.chartType,
    (props) => props.interpolate,
    (props) => props.mainAxisEncoding,

    (props) => props.xAxisMode,
    (props) => props.xAxisField,
    (props) => props.xAxisType,
    (props) => props.xAxisOrder,
    (props) => props.xAxisLabelAngle,
    (props) => props.xAxisLabelLimit,
    (props) => props.xAxisBins,

    (props) => props.yAxisMode,
    (props) => props.yAxisField,
    (props) => props.yAxisType,
    (props) => props.yAxisOrder,
    (props) => props.yAxisLabelAngle,
    (props) => props.yAxisLabelLimit,
    (props) => props.yAxisBins,

    (props) => props.seriesField,
    (props) => props.seriesType,
    (props) => props.seriesOrder ?? "ascending",
    (props) => props.seriesStacking,
    (props) => props.seriesScale,

    (props) => props.facetField,
    (props) => props.facetOrder,
    (props) => props.facetGridColumns,
    (
      chartType,
      interpolateType,
      mainAxisEncoding,

      xAxisMode,
      xAxisDataColumn,
      xAxisType,
      xAxisOrder,
      xAxisLabelAngle,
      xAxisLabelLimit,
      xAxisBins,

      yAxisMode,
      yAxisDataColumn,
      yAxisType,
      yAxisOrder,
      yAxisLabelAngle,
      yAxisLabelLimit,
      yAxisBins,

      seriesDataColumn,
      seriesFieldType,
      seriesOrder,
      seriesStacking,
      seriesScale,

      facetField,
      facetOrder,
      facetGridColumns,
    ) => {
      const aggregateTransform = {
        aggregate: [],
        groupby: [],
      };
      const vlSpec = {
        $schema: "https://vega.github.io/schema/vega-lite/v4.json",
        transform: [ aggregateTransform ],
        mark: {
          type: chartType,
          point: (chartType === "line"),
          interpolate: interpolateType,
          // fillOpacity: 0.5,
          // strokeOpacity: 1,
          strokeWidth: 2,
          thickness: (chartType === "tick") ? 4 : undefined,
        },
        encoding: {
          tooltip: [],
        },
        // data: { name: "table" }, // note: vega-lite data attribute is a plain object instead of an array
      };

      const xAxis = {
        dataColumn: xAxisDataColumn,
        encoding: "x",
        labelAngle: xAxisLabelAngle,
        labelLimit: xAxisLabelLimit,
        maxbins: xAxisBins,
        mode: xAxisMode,
        order: xAxisOrder,
        type: xAxisType,
      };
      const yAxis = {
        dataColumn: yAxisDataColumn,
        encoding: "y",
        labelAngle: yAxisLabelAngle,
        labelLimit: yAxisLabelLimit,
        maxbins: yAxisBins,
        mode: yAxisMode,
        order: yAxisOrder,
        type: yAxisType,
      };

      let mainAxis;
      let secondaryAxis;
      if (mainAxisEncoding === "x") {
        mainAxis = xAxis;
        secondaryAxis = yAxis;
      }
      else if (mainAxisEncoding === "y") {
        mainAxis = yAxis;
        secondaryAxis = xAxis;
      }

      // We cannot have a chart without a x or y axis
      if (!mainAxis || !mainAxis.dataColumn) {
        return undefined;
      }

      //#region Add main axis
      if (mainAxis.mode === "field") {
        vlSpec.encoding[mainAxis.encoding] = {
          field: mainAxis.dataColumn.name,
          type: mainAxis.type,
          axis: {
            title: mainAxis.dataColumn.label,
            format: (mainAxis.type === "temporal") ? "%Y-%m-%d" : undefined,
            labelAngle: mainAxis.labelAngle,
            labelLimit: mainAxis.labelLimit,
          },
          timeUnit: (mainAxis.type === "temporal") ? "yearmonthdate" : undefined,
          sort: mainAxis.order,
        };

        if (mainAxis.maxbins > 1) {
          vlSpec.encoding[mainAxis.encoding].field = "--mr-bins";
          vlSpec.encoding[mainAxis.encoding].bind = { binned: true };
          vlSpec.encoding[`${mainAxis.encoding}2`] = { field: "--mr-bins_end" };

          aggregateTransform.groupby.push("--mr-bins");
          aggregateTransform.groupby.push("--mr-bins_end");

          vlSpec.transform.unshift({
            bin: { maxbins: mainAxis.maxbins },
            field: mainAxis.dataColumn.name,
            as: "--mr-bins",
          });

          vlSpec.encoding.tooltip.unshift({
            field: "--mr-bins_end",
            title: `${mainAxis.dataColumn.label} (to)`,
            type: mainAxis.type,
          });
          vlSpec.encoding.tooltip.unshift({
            field: "--mr-bins",
            title: `${mainAxis.dataColumn.label} (from)`,
            type: mainAxis.type,
          });
        }
        else {
          aggregateTransform.groupby.push(mainAxis.dataColumn.name);

          vlSpec.encoding.tooltip.unshift({
            field: mainAxis.dataColumn.name,
            title: mainAxis.dataColumn.label,
            type: mainAxis.type,
          });
        }
      }
      //#endregion

      //#region Add other axis
      if (secondaryAxis.mode === "frequency") {
        aggregateTransform.aggregate = [{ op: "sum", field: "--mr-scalar", as: "--mr-frequency" }];
        vlSpec.encoding[secondaryAxis.encoding] = {
          field: "--mr-frequency",
          type: "quantitative",
          axis: { title: "Number of entries" },
        };
      }
      else if (secondaryAxis.mode === "cumulative-frequency") {
        aggregateTransform.aggregate = [{ op: "sum", field: "--mr-scalar", as: "--mr-frequency" }];
        vlSpec.transform.push({
          sort: [{ field: mainAxis.dataColumn.name }],
          window: [{ op: "sum", field: "--mr-frequency", as: "--mr-cumulative-frequency" }],
          frame: [null, 0],
        });
        vlSpec.encoding[secondaryAxis.encoding] = {
          field: "--mr-cumulative-frequency",
          type: "quantitative",
          axis: { title: "Cumulative number of entries" },
        };
      }
      else if (secondaryAxis.mode === "sum-of" && secondaryAxis.dataColumn) {
        aggregateTransform.aggregate = [{ op: "sum", field: secondaryAxis.dataColumn.name, as: "--mr-sum" }];
        vlSpec.encoding[secondaryAxis.encoding] = {
          field: "--mr-sum",
          type: "quantitative",
          axis: { title: `Sum of ${secondaryAxis.dataColumn.label}` },
        };
      }
      else if (secondaryAxis.mode === "cumulative-sum-of" && secondaryAxis.dataColumn) {
        aggregateTransform.aggregate = [{ op: "sum", field: secondaryAxis.dataColumn.name, as: "--mr-sum" }];
        vlSpec.transform.push({
          sort: [{ field: mainAxis.dataColumn.name }],
          window: [{ op: "sum", field: "--mr-sum", as: "--mr-cumulative-sum" }],
          frame: [null, 0],
        });
        vlSpec.encoding[secondaryAxis.encoding] = {
          field: "--mr-cumulative-sum",
          type: "quantitative",
          axis: { title: `Cumulative sum of ${secondaryAxis.dataColumn.label}` },
        };
      }
      else if (secondaryAxis.mode === "average-of" && secondaryAxis.dataColumn) {
        aggregateTransform.aggregate = [{ op: "average", field: secondaryAxis.dataColumn.name, as: "--mr-average" }];
        vlSpec.encoding[secondaryAxis.encoding] = {
          field: "--mr-average",
          type: "quantitative",
          axis: { title: `Average of ${secondaryAxis.dataColumn.label}` },
        };
      }

      if (vlSpec.encoding[secondaryAxis.encoding]) {
        vlSpec.encoding.tooltip.unshift({
          field: vlSpec.encoding[secondaryAxis.encoding].field,
          type: vlSpec.encoding[secondaryAxis.encoding].type,
          title: vlSpec.encoding[secondaryAxis.encoding].axis.title,
        });

        vlSpec.encoding[secondaryAxis.encoding].axis.tickMinStep = 1;
        vlSpec.encoding[secondaryAxis.encoding].axis.labelLimit = secondaryAxis.labelLimit;
        vlSpec.encoding[secondaryAxis.encoding].axis.gridWidth = {
          condition: { test: "floor(datum.value) === datum.value", value: 1 },
          value: 0,
        };

        if (seriesStacking === "facet" || seriesStacking === "overlapping") {
          vlSpec.encoding[secondaryAxis.encoding].stack = false;
          vlSpec.encoding[secondaryAxis.encoding].axis = null;
        }
        else if (seriesStacking === "normalised") {
          vlSpec.encoding[secondaryAxis.encoding].stack = "normalize";
        }
        else if (seriesStacking === "stacked") {
          vlSpec.encoding[secondaryAxis.encoding].stack = true;
        }
        else {
          vlSpec.encoding[secondaryAxis.encoding].stack = true;
        }
      }
      //#endregion

      //#region Add colour series
      if (seriesDataColumn) {
        vlSpec.encoding[mainAxis.encoding].axis.title += ` (coloured by ${seriesDataColumn.label})`;
        aggregateTransform.groupby.push(seriesDataColumn.name);
        vlSpec.encoding.tooltip.unshift({
          field: seriesDataColumn.name,
          title: seriesDataColumn.label,
          type: seriesFieldType,
        });
        if (seriesStacking === "facet" || seriesStacking === "overlapping") {
          vlSpec.encoding.row = {
            field: seriesDataColumn.name,
            type: seriesFieldType,
            spacing: 0,
            header: {
              title: seriesDataColumn.label,
              labelPadding: 0,
              labelAlign: "left",
              labelAngle: 0,
              labelLimit: secondaryAxis.labelLimit,
            },
            sort: { op: "sum", field: vlSpec.encoding[secondaryAxis.encoding].field, order: seriesOrder },
          };
        }

        vlSpec.encoding.color = {
          field: seriesDataColumn.name,
          type: seriesFieldType,
          scale: seriesScale,
          legend: false,
        };

        vlSpec.transform.unshift({
          joinaggregate: [{
            op: "sum",
            field: "--mr-scalar",
            as: "--mr-frequency-total",
          }],
          groupby: [ vlSpec.encoding[mainAxis.encoding].field ],
        });
        aggregateTransform.groupby.push("--mr-frequency-total");
        vlSpec.encoding.tooltip.push({
          field: "--mr-frequency-total",
          title: "Total number of entries",
          type: "quantitative",
        });
      }
      else {
        vlSpec.encoding.color = {
          value: defaultColourRange[0],
          scale: false,
          legend: false,
        };
      }
      //#endregion

      //#region Add facet
      if (facetField) {
        aggregateTransform.groupby.push(facetField);
        vlSpec.encoding.facet = {
          field: facetField,
          type: "nominal",
          columns: facetGridColumns,
          sort: facetOrder,
        };
        vlSpec.resolve = { "axis": { "x": "independent", "y": "independent" } };
      }
      //#endregion

      return vlSpec;
    },
  );

  vlSpecSelector = createSelector(
    (props) => props.seriesStacking,
    (props) => props.seriesScale,
    (props) => this.defaultSpecSelector(props),
    (props) => props.xAxisLabelLimit,
    (props) => props.yAxisLabelLimit,
    (props) => props.facetGridColumns,
    (props) => props.facetGridRows,
    (props) => props.width,
    (props) => props.height,
    (
      seriesStacking,
      seriesScale,
      vlSpec,
      xAxisLabelLimit,
      yAxisLabelLimit,
      facetGridColumns,
      facetGridRows,
      width,
      height,
    ) => {
      if (vlSpec) {
        vlSpec.bounds = "full";
        vlSpec.autosize = {
          type: "fit",
          contains: "padding",
        };

        // Reset the scale to remove any previous facet/overlapping range
        vlSpec.width = width;
        vlSpec.height = height;

        if (vlSpec.encoding.y) {
          vlSpec.encoding.y.scale = undefined;

          // Divide the overall chart pane height by the number of unique values (number of rows)
          // in row view (facet) and overlapping row view (overlapping)
          if ((seriesStacking === "facet" || seriesStacking === "overlapping")) {
            const numberOfDomainValues = seriesScale.domain.length;
            const step = Math.floor((height - xAxisLabelLimit - 40 /* padding */ - 32 /* title */) / numberOfDomainValues);
            if (seriesStacking === "overlapping" && numberOfDomainValues > 1) {
              const overlap = numberOfDomainValues / 2;
              vlSpec.encoding.y.scale = { range: [ step, -overlap * step ] };
            }
            vlSpec.width = width - yAxisLabelLimit - 16 /* padding */ - 32/* title */;
            vlSpec.height = step;
          }
        }

        if (vlSpec.encoding.facet) {
          vlSpec.width = (width / facetGridColumns) - yAxisLabelLimit - 16/* padding */ - 32/* title */;
          vlSpec.height = (height / facetGridRows) - xAxisLabelLimit - 40/* padding */ - 32/* title */;
        }

        return { ...vlSpec };
      }

      return vlSpec;
    }
  );

  vegaSpecSelector = createSelector(
    (props) => this.vlSpecSelector(props),
    (props) => props.width,
    (props) => props.height,
    (
      vlSpec,
      width,
      height,
    ) => {
      if (vlSpec) {
        return convertChartSpec(
          vlSpec,
          width,
          height,
        );
      }
      else {
        return undefined;
      }
    },
  );

  render() {
    const { props } = this;

    const vegaSpec = this.vegaSpecSelector(props);

    if (vegaSpec instanceof Error) {
      return (
        <div className="mr-error">
          { vegaSpec.message }
        </div>
      );
    }

    if (vegaSpec) {
      return (
        <Vega
          data={props.chartData}
          logLevel={2}
          onError={props.onError}
          onParseError={props.onParseError}
          ref={props.chartRef}
          signalListeners={props.signalListeners}
          spec={vegaSpec}
          tooltip={new Handler().call}
          // onNewView={console.debug}
        />
      );
    }

    return null;
  }
}

ChartDefaultEmbed.propTypes = {
  chartData: PropTypes.shape({
    table: PropTypes.arrayOf(
      PropTypes.object.isRequired,
    ).isRequired,
  }).isRequired,
  chartId: PropTypes.string.isRequired,
  chartRef: PropTypes.object,
  chartType: ChartTypes,
  height: PropTypes.number.isRequired,
  onError: PropTypes.func,
  onParseError: PropTypes.func,
  signalListeners: PropTypes.object,
  width: PropTypes.number.isRequired,

  interpolate: PropTypes.string,
  xAxisOrder: PropTypes.string,
  xAxisLabelAngle: PropTypes.string,
  xAxisLabelLimit: PropTypes.number,
  xAxisBins: PropTypes.number,
  yAxisOrder: PropTypes.string,
  yAxisLabelAngle: PropTypes.string,
  yAxisLabelLimit: PropTypes.number,
  yAxisBins: PropTypes.number,
  seriesOrder: PropTypes.string,
  facetField: PropTypes.string,
  facetOrder: PropTypes.string,
  facetGridColumns: PropTypes.number,
  facetGridRows: PropTypes.string,
};

export default ChartDefaultEmbed;
