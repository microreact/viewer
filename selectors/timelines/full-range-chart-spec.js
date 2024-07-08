import defaults from "../../defaults.js";
import { createKeyedStateSelector } from "../../utils/state";

import configSelector from "../config";
import paneSizeSelector from "../panes/pane-size";

const fullRangeChartSpecSelector = createKeyedStateSelector(
  (_state, _timelineId, theme) => theme?.typography?.body1?.fontFamily || defaults.theme.fonts.body,
  (state, timelineId) => paneSizeSelector(state, timelineId),
  (state) => configSelector(state),
  (
    fontStack,
    size,
    defaults,
  ) => {
    const vlSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v4.json",
      autosize: {
        contains: "padding",
        type: "fit",
      },
      bounds: "flush",
      data: { name: "dataset" },
      mark: { type: "rect" },
      config: {
        view: {
          stroke: "transparent",
        },
        font: fontStack,
        title: {
          font: fontStack,
        },
        axis: {
          labelFont: fontStack,
          titleFont: fontStack,
        },
        legend: {
          labelFont: fontStack,
          titleFont: fontStack,
        },
        tooltip: {
          font: fontStack,
        }
      },
      encoding: {
        x: {
          field: "unitStartDate",
          type: "temporal",
          axis: {
            title: null,
            grid: false,
            tickExtra: true,
            bandPosition: 1,
            padding: 0,
            tickColor: defaults.theme.primary.main,
            tickSize: 3,
            // tickWidth: 0,
            // domainWidth: 0,
            labelAlign: {
              condition: [
                {
                  test: {
                    field: "index",
                    equal: 0,
                  },
                  value: "left",
                },
                {
                  test: {
                    field: "index",
                    equal: 1,
                  },
                  value: "right",
                },
              ],
              value: "center",
            },
          },
          // scale: { domain: dataTemporalRange },
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

        // strokeOpacity: {
        //   value: 0.1,
        // },

        x2: {
          field: "unitEndDate",
          type: "temporal",
          axis: null,
        },
        y: {
          // aggregate: "sum",
          field: "groupCount",
          type: "quantitative",
          axis: null,
        },

        // tooltip: [
        //   {
        //     field: "startDate",
        //     type: "temporal",
        //     title: "From",
        //   },
        //   {
        //     field: "endDate",
        //     type: "temporal",
        //     title: "To",
        //   },
        //   {
        //     field: "rows",
        //     title: "Number of entries",
        //   },
        // ],
      },
      height: 48,
      padding: { left: 0, top: 0, right: 0, bottom: 2 },
      width: size.width - 32,
    };

    return vlSpec;
  },
);

export default fullRangeChartSpecSelector;
