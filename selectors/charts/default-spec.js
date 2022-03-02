import { createKeyedStateSelector } from "../../utils/state";

import colourMapForFieldSelector from "../styles/colour-map-for-field";

import chartStateSelector from "./chart-state";
import seriesStackingSelector from "./series-stacking";
import xAxisFieldSelector from "./x-axis-field";
import yAxisFieldSelector from "./y-axis-field";
import seriesFieldSelector from "./series-field";
import xAxisTypeSelector from "./x-axis-type";
import yAxisTypeSelector from "./y-axis-type";
import seriesTypeSelector from "./series-type";
import chartTypeSelector from "./chart-type";
import paneSizeSelector from "../panes/pane-size";
import rowsSelector from "../datasets/rows";
import filteredIdsSelector from "../filters/filtered-ids";
import yAxisModeSelector from "./y-axis-mode";
import xAxisModeSelector from "./x-axis-mode";
import mainAxisEncodingSelector from "./main-axis-encoding";

const defaultColourRange = [ "#3C7383" ];

const seriesValueToColourMapSelector = (state, chartId) => {
  const seriesDataColumn = seriesFieldSelector(state, chartId);
  if (seriesDataColumn) {
    return colourMapForFieldSelector(state, seriesDataColumn.name);
  }
  else {
    return undefined;
  }
};

const seriesScaleSelector = createKeyedStateSelector(
  (state, chartId) => seriesFieldSelector(state, chartId),
  (state) => rowsSelector(state),
  (state) => filteredIdsSelector(state),
  (state, chartId) => seriesValueToColourMapSelector(state, chartId),
  (state) => state.styles.defaultColour,
  (
    seriesDataColumn,
    rows,
    filteredIds,
    seriesValueToColourMap,
    defaultColour,
  ) => {
    if (!seriesDataColumn) {
      return null;
    }

    const uniqueValues = new Set();
    for (const row of rows) {
      if (!filteredIds || filteredIds.has(row[0])) {
        const value = row[seriesDataColumn.name];
        uniqueValues.add(value);
      }
    }
    const uniqueSeriesValues = Array.from(uniqueValues).sort();

    let colours = defaultColourRange;
    if (seriesValueToColourMap) {
      colours = [];
      for (const value of uniqueSeriesValues) {
        colours.push(seriesValueToColourMap.get(value) ?? defaultColour);
      }
      colours = Array.from(colours);

    }

    return {
      domain: uniqueSeriesValues,
      range: colours,
    };
  },
);

const defaultSpecSelector = createKeyedStateSelector(
  (state, chartId) => chartTypeSelector(state, chartId),
  (state, chartId) => chartStateSelector(state, chartId).interpolate,
  (state, chartId) => mainAxisEncodingSelector(state, chartId),

  (state, chartId) => xAxisModeSelector(state, chartId),
  (state, chartId) => xAxisFieldSelector(state, chartId),
  (state, chartId) => xAxisTypeSelector(state, chartId),
  (state, chartId) => chartStateSelector(state, chartId).xAxisOrder,
  (state, chartId) => chartStateSelector(state, chartId).xAxisLabelAngle,
  // (state, chartId) => chartStateSelector(state, chartId).xAxisBins,

  (state, chartId) => yAxisModeSelector(state, chartId),
  (state, chartId) => yAxisFieldSelector(state, chartId),
  (state, chartId) => yAxisTypeSelector(state, chartId),
  (state, chartId) => chartStateSelector(state, chartId).yAxisOrder,
  (state, chartId) => chartStateSelector(state, chartId).yAxisLabelAngle,

  (state, chartId) => seriesFieldSelector(state, chartId),
  (state, chartId) => seriesTypeSelector(state, chartId),
  (state, chartId) => chartStateSelector(state, chartId).seriesOrder ?? "ascending",
  (state, chartId) => seriesStackingSelector(state, chartId),
  (state, chartId) => seriesScaleSelector(state, chartId),

  (
    chartType,
    interpolateType,
    mainAxisEncoding,

    xAxisMode,
    xAxisDataColumn,
    xAxisType,
    xAxisOrder,
    xAxisLabelAngle,
    // xAxisBins,

    yAxisMode,
    yAxisDataColumn,
    yAxisType,
    yAxisOrder,
    yAxisLabelAngle,

    seriesDataColumn,
    seriesFieldType,
    seriesOrder,
    seriesStacking,
    seriesScale,
  ) => {
    const vlSpec = {
      $schema: "https://vega.github.io/schema/vega-lite",
      transform: [
        {
          aggregate: [],
          groupby: [],
        },
      ],
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
      mode: xAxisMode,
      order: xAxisOrder,
      type: xAxisType,
    };
    const yAxis = {
      dataColumn: yAxisDataColumn,
      encoding: "y",
      labelAngle: yAxisLabelAngle,
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
      vlSpec.transform[0].groupby.push(mainAxis.dataColumn.name);

      vlSpec.encoding[mainAxis.encoding] = {
        field: mainAxis.dataColumn.name,
        type: mainAxis.type,
        axis: {
          title: mainAxis.dataColumn.label,
          format: (mainAxis.type === "temporal") ? "%Y-%m-%d" : undefined,
          labelAngle: mainAxis.labelAngle,
        },
        timeUnit: (mainAxis.type === "temporal") ? "yearmonthdate" : undefined,
        sort: xAxisOrder,
      };

      vlSpec.encoding.tooltip.unshift({
        field: mainAxis.dataColumn.name,
        title: mainAxis.dataColumn.label,
        type: mainAxis.type,
      });
    }
    //#endregion

    //#region Add other axis
    if (secondaryAxis.mode === "frequency") {
      vlSpec.transform[0].aggregate = [{ op: "sum", field: "--mr-scalar", as: "--mr-frequency" }];
      vlSpec.encoding[secondaryAxis.encoding] = {
        field: "--mr-frequency",
        type: "quantitative",
        axis: {
          tickMinStep: 1,
          title: "Number of entries",
          gridWidth: {
            condition: { test: "floor(datum.value) === datum.value", value: 1 },
            value: 0,
          },
        },
        // stack: false,
      };
    }
    else if (secondaryAxis.mode === "cumulative-frequency") {
      vlSpec.transform[0].aggregate = [{ op: "sum", field: "--mr-scalar", as: "--mr-frequency" }];
      vlSpec.transform.push({
        sort: [{ field: mainAxis.dataColumn.name }],
        window: [{ op: "sum", field: "--mr-frequency", as: "--mr-cumulative-frequency" }],
        frame: [null, 0],
      });
      vlSpec.encoding[secondaryAxis.encoding] = {
        field: "--mr-cumulative-frequency",
        type: "quantitative",
        axis: {
          tickMinStep: 1,
          title: "Cumulative number of entries",
          gridWidth: {
            condition: { test: "floor(datum.value) === datum.value", value: 1 },
            value: 0,
          },
        },
      };
    }
    else if (secondaryAxis.mode === "sum-of" && secondaryAxis.dataColumn) {
      vlSpec.transform[0].aggregate = [{ op: "sum", field: secondaryAxis.dataColumn.name, as: "--mr-sum" }];
      vlSpec.encoding[secondaryAxis.encoding] = {
        field: "--mr-sum",
        type: "quantitative",
        axis: {
          tickMinStep: 1,
          title: `Sum of ${secondaryAxis.dataColumn.label}`,
          gridWidth: {
            condition: { test: "floor(datum.value) === datum.value", value: 1 },
            value: 0,
          },
        },
      };
    }
    else if (secondaryAxis.mode === "cumulative-sum-of" && secondaryAxis.dataColumn) {
      vlSpec.transform[0].aggregate = [{ op: "sum", field: secondaryAxis.dataColumn.name, as: "--mr-sum" }];
      vlSpec.transform.push({
        sort: [{ field: mainAxis.dataColumn.name }],
        window: [{ op: "sum", field: "--mr-sum", as: "--mr-cumulative-sum" }],
        frame: [null, 0],
      });
      vlSpec.encoding[secondaryAxis.encoding] = {
        field: "--mr-cumulative-sum",
        type: "quantitative",
        axis: {
          tickMinStep: 1,
          title: `Cumulative sum of ${secondaryAxis.dataColumn.label}`,
          gridWidth: {
            condition: { test: "floor(datum.value) === datum.value", value: 1 },
            value: 0,
          },
        },
      };
    }
    else if (secondaryAxis.mode === "average-of" && secondaryAxis.dataColumn) {
      vlSpec.transform[0].aggregate = [{ op: "average", field: secondaryAxis.dataColumn.name, as: "--mr-average" }];
      vlSpec.encoding[secondaryAxis.encoding] = {
        field: "--mr-average",
        type: "quantitative",
        axis: {
          tickMinStep: 1,
          title: `Average of ${secondaryAxis.dataColumn.label}`,
          gridWidth: {
            condition: { test: "floor(datum.value) === datum.value", value: 1 },
            value: 0,
          },
        },
      };
    }

    if (vlSpec.encoding[secondaryAxis.encoding]) {
      vlSpec.encoding.tooltip.unshift({
        field: vlSpec.encoding[secondaryAxis.encoding].field,
        type: vlSpec.encoding[secondaryAxis.encoding].type,
        title: vlSpec.encoding[secondaryAxis.encoding].axis.title,
      });

      vlSpec.encoding[secondaryAxis.encoding].axis.tickMinStep = 1;
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
      vlSpec.transform[0].groupby.push(seriesDataColumn.name);
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
            labelPadding: 4,
            // labelFontSize: 11,
            // titleFontSize: 13,
            labelAlign: "left",
            labelAngle: 0,
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
      vlSpec.transform[1].groupby.push("--mr-frequency-total");
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

    return vlSpec;
  },
);

const vlSpecSelector = createKeyedStateSelector(
  (state, chartId) => seriesStackingSelector(state, chartId),
  (state, chartId) => seriesScaleSelector(state, chartId),
  (state, chartId) => defaultSpecSelector(state, chartId),
  (state, chartId) => paneSizeSelector(state, chartId),
  (
    seriesStacking,
    seriesScale,
    vlSpec,
    size,
  ) => {
    if (vlSpec) {
      vlSpec.bounds = "flush";
      vlSpec.autosize = {
        type: "fit",
        contains: "padding",
      };

      if (vlSpec.encoding.y) {
        vlSpec.encoding.y.scale = undefined;
        // Divide the overall chart pane height by the number of unique values (number of rows)
        // in row view (facet) and overlapping row view (overlapping)
        if ((seriesStacking === "facet" || seriesStacking === "overlapping")) {
          const numberOfDomainValues = seriesScale.domain.length;
          const step = Math.floor((size.height - 40) / numberOfDomainValues);
          if (seriesStacking === "overlapping" && numberOfDomainValues > 1) {
            const overlap = numberOfDomainValues / 2;
            vlSpec.encoding.y.scale = { range: [ step, -overlap * step ] };
          }
          vlSpec.width = size.width - 120;
          vlSpec.height = step;
        }
        else {
          vlSpec.width = size.width;
          vlSpec.height = size.height;
        }
      }

      return { ...vlSpec };
    }

    return vlSpec;
  }
);

export default vlSpecSelector;
