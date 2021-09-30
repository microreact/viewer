import { createKeyedStateSelector } from "../../utils/state";
import { vegaLiteToVega } from "../../utils/charts";

import configSelector from "../config";
import dataColumnSelector from "./data-column";
import paneSizeSelector from "../panes/pane-size";
import chartAxisTypeSelector from "./chart-axis-type";
import slicerStateSelector from "./slicer-state";

const chartSpecSelector = createKeyedStateSelector(
  (state, slicerId) => dataColumnSelector(state, slicerId),
  (state, slicerId) => chartAxisTypeSelector(state, slicerId),
  (state, slicerId) => slicerStateSelector(state, slicerId).chartMainAxis,
  (state, slicerId) => slicerStateSelector(state, slicerId).includedValues,
  (state, slicerId) => slicerStateSelector(state, slicerId).topNValues,
  (state, slicerId) => slicerStateSelector(state, slicerId).chartOrder,
  (state, slicerId) => slicerStateSelector(state, slicerId).chartMaxBins,
  (state, slicerId) => paneSizeSelector(state, slicerId),
  (state) => configSelector(state),
  (
    dataColumn,
    axisType,
    chartMainAxis,
    includedValues,
    topNValues,
    chartOrder,
    chartMaxBins,
    size,
    defaults,
  ) => {
    const isBinned = (axisType === "quantitative");
    const binnedFieldName = `bin_maxbins_${chartMaxBins}_${dataColumn.name}_range`;
    const vlSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v4.json",
      autosize: {
        contains: "padding",
        type: "fit",
      },
      bounds: "flush",
      config: {
        axis: {
          labelFont: defaults.fontFamily,
          labelFontSize: 11,
        },
        view: {
          stroke: "transparent",
        },
      },
      data: { name: "table" },
      mark: "bar",
      encoding: {
        x: {
          field: dataColumn.name,
          type: isBinned ? "ordinal" : axisType,
          axis: { title: null },
          bin: isBinned ? { maxbins: chartMaxBins } : false,
          sort: (
            (chartOrder !== "alphabetical")
              ?
              {
                op: "count",
                order: chartOrder,
              }
              :
              undefined
          ),
        },

        y: {
          aggregate: "sum",
          field: "--mr-scalar",
          type: "quantitative",
          axis: { title: null },
        },

        fill: {
          value: defaults.theme.primary.light,
        },

        strokeWidth: {
          value: 1,
        },

        stroke: {
          value: defaults.theme.background.main,
        },

        tooltip: [
          {
            field: isBinned ? binnedFieldName : dataColumn.name,
            type: "nominal",
            title: dataColumn.name,
          },
          {
            field: "sum_--mr-scalar",
            type: "quantitative",
            title: "Entries",
          },
        ],
      },
      height: size.height,
      padding: { left: 8, top: 24, right: 8, bottom: 8 },
      width: size.width,

      selection: {
        brush: {
          type: "interval",
          encodings: [ chartMainAxis ],
        },
      },
    };

    if (includedValues === "top" && topNValues && Number.isInteger(topNValues) && topNValues > 0) {
      vlSpec.encoding.y.field = "count";
      vlSpec.encoding.y.aggregate = undefined;
      vlSpec.transform = [
        {
          aggregate: [{ op: "count", as: "count" }],
          groupby: [ dataColumn.name ],
        },
        {
          window: [{
            op: "rank",
            as: "rank",
          }],
          sort: [{ field: "count", order: "descending" }],
        },
        {
          filter: `datum.rank <= ${topNValues}`,
        },
      ];
      if (vlSpec.encoding.x.sort) {
        vlSpec.encoding.x.sort.op = undefined;
        vlSpec.encoding.x.sort.field = "rank";
        vlSpec.encoding.x.sort.order = (vlSpec.encoding.x.sort.order === "descending") ? "ascending" : "descending";
      }
      vlSpec.encoding.tooltip[1].field = "count";
    }

    if (chartMainAxis === "y") {
      const mainAxis = vlSpec.encoding.x;
      vlSpec.encoding.x = vlSpec.encoding.y;
      vlSpec.encoding.y = mainAxis;
    }

    const vgSpec = vegaLiteToVega(vlSpec);

    return vgSpec;
  }
);

export default chartSpecSelector;
