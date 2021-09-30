import { createKeyedStateSelector } from "../../utils/state";
import { vegaLiteToVega } from "../../utils/charts";

import defaultsSelector from "../ui/defaults";
import paneSizeSelector from "../panes/pane-size";
import laneFieldSelector from "./lane-field";
import filteredRangeUnitSelector from "./filtered-range-unit";
import coloursDataColumnSelector from "../styles/colours-data-column";

const chartSpecSelector = createKeyedStateSelector(
  (state, timelineId) => filteredRangeUnitSelector(state, timelineId),
  (state, timelineId) => state.timelines[timelineId].style,
  (state, timelineId) => state.timelines[timelineId].nodeSize,
  (state, timelineId) => laneFieldSelector(state, timelineId),
  (state, timelineId) => paneSizeSelector(state, timelineId),
  (state) => defaultsSelector(state),
  (state) => coloursDataColumnSelector(state),
  (
    unit,
    style,
    nodeSize,
    laneField,
    size,
    defaults,
    colourByDataField,
  ) => {
    const vlSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v4.json",
      autosize: {
        contains: "padding",
        type: "fit",
      },
      // "selection": {"grid": {"type": "interval", "bind": "scales"}},
      // "selection": {
      //   "zoom_x": {"type": "interval", "bind": "scales", "encodings": ["x"]},
      //   "zoom_y": {"type": "interval", "bind": "scales", "encodings": ["y"]}
      // },
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
      data: { name: "dataset" },
      encoding: {
        x: {
          // bin: true,

          field: "groupStartDate",
          type: "temporal",
          // timeUnit: "month",

          // field: "binned dateLabel",

          // "bin": {
          //   "binned": true,
          //   "step": 1
          // },

          // field: "dateLabel",
          // type: "nominal",
          axis: {
            title: null,
            // grid: false,
            // // formatType: "time",
            // // format: "%Y-%m-%d",
            // // labelFlush: true,
            // // labelFlushOffset: 48,

            // tickExtra: true,
            // bandPosition: 1,
            // padding: 0,
            // tickColor: defaults.theme.primary.main,
            // // labelColor: {
            // //   condition: {
            // //     test: {
            // //       field: "index",
            // //       equal: 1,
            // //     },
            // //     value: null,
            // //   },
            // //   value: "black",
            // // },
            // // labelExpr: "(datum.index) < 1 ? (datum.label ) : ''",
            // // labelExpr: "[ (datum.index) < 1 ? timeFormat(datum.value, '%b') : '', (datum.index < 1 && timeFormat(datum.value, '%m') == '01') ? timeFormat(datum.value, '%Y') : '']",
            // // labelExpr: `
            // //   datum.index < 1
            // //     ?
            // //     (
            // //       timeFormat(datum.value, '%m') == '01'
            // //         ?
            // //         timeFormat(datum.value, '%Y')
            // //         :
            // //         timeFormat(datum.value, '%b')
            // //     )
            // //     :
            // //     ''
            // // `,
            // // labelPadding: 20,
            // tickSize: 14,
            // tickWidth: 0,
            // domainWidth: 0,
            // labelAlign: {
            //   condition: [
            //     {
            //       test: {
            //         field: "index",
            //         equal: 0,
            //       },
            //       value: "left",
            //     },
            //     {
            //       test: {
            //         field: "index",
            //         equal: 1,
            //       },
            //       value: "right",
            //     },
            //   ],
            //   value: "center",
            // },
          },

          // sort: { field: 'dateValue', order: 'ascending' },

          // scale: { domain: dataTemporalRange },
        },

        color: {
          field: "colour",
          scale: null,
        },

        fillOpacity: {
          field: "isSelected",
          scale: {
            domain: [ false, true ],
            range: [ 0.28, 1 ],
          },
          legend: false,
        },

        tooltip: [
          {
            field: "groupLabel",
            type: "nominal",
            title: unit,
          },
          {
            field: "groupEntries",
            type: "quantitative",
            title: "group entries",
          },
        ],
      },
      height: size.height - 48 - 12,
      padding: { left: 16, top: 32, right: 16, bottom: 2 },

      width: size.width,
    };

    //#region Tooltip based on chat-type
    if (style === "bubble") {
      if (laneField) {
        vlSpec.encoding.tooltip.push({
          field: "laneLabel",
          type: "nominal",
          title: laneField.name,
        });
        vlSpec.encoding.tooltip.push({
          field: "pie-count",
          type: "quantitative",
          title: "pie-count",
        });
      }

      if (colourByDataField && laneField !== colourByDataField) {
        vlSpec.encoding.tooltip.push({
          field: "colour-label",
          type: "nominal",
          title: colourByDataField.name,
        });
        vlSpec.encoding.tooltip.push({
          field: "slice-count",
          type: "quantitative",
          title: "slice-count",
        });
      }
    }
    else if (colourByDataField) {
      vlSpec.encoding.tooltip.push({
        field: "colour-label",
        type: "nominal",
        title: colourByDataField.name,
      });
      vlSpec.encoding.tooltip.push({
        field: "__count",
        type: "quantitative",
        title: "colour entries",
      });
    }
    //#endregion

    if (style === "bar" || style === "normalised-bar") {
      vlSpec.mark = { type: "bar" };
      vlSpec.encoding.x2 = {
        field: "groupEndDate",
        type: "temporal",
        axis: null,
      };
      // vlSpec.encoding.color = {
      //   field: "colour",
      //   scale: null,
      // };
      vlSpec.encoding.y = {
        aggregate: "count",
        type: "quantitative",
        axis: null,
      };
      if (style === "normalised-bar") {
        vlSpec.encoding.y.stack = "normalize";
      }
    }
    else if (style === "bubble") {
      vlSpec.transform = [
        {
          aggregate: [{
            op: "count",
            as: "slice-count",
          }],
          groupby: [
            "groupStartDate",
            "groupEndDate",
            "groupLabel",
            "groupEntries",
            "colour",
            "colour-label",
            "laneLabel",
          ],
        },

        {
          joinaggregate: [{
            op: "sum",
            field: "slice-count",
            as: "column-count",
          }],
          groupby: ["groupStartDate"],
        },

        {
          joinaggregate: [{
            op: "sum",
            field: "slice-count",
            as: "pie-count",
          }],
          groupby: ["groupStartDate", "laneLabel"],
        },

        {
          stack: "slice-count",
          offset: "normalize",
          as: ["startAngle", "endAngle"],
          groupby: ["groupStartDate", "laneLabel"],
          sort: [{ field: "colour", order: "descending" }],
        },

        { calculate: "6.28318530718 * datum.startAngle", as: "startAngle" },
        { calculate: "6.28318530718 * datum.endAngle", as: "endAngle" },

      ];

      vlSpec.mark = { type: "arc" };

      vlSpec.encoding.radius = {
        field: "pie-count",
        type: "quantitative",
        // "legend": {"title": "Annual Global Deaths", "clipHeight": 30},
        legend: false,
        // scale: null,
        scale: {
          type: "log",
          rangeMin: 7 /* half of 14px */,
          rangeMax: nodeSize / 2,
        },
      };

      vlSpec.encoding.theta = {
        field: "startAngle",
        type: "quantitative",
        scale: null,
      };

      vlSpec.encoding.theta2 = {
        field: "endAngle",
        type: "quantitative",
        scale: null,
      };

      if (laneField) {
        vlSpec.encoding.y = {
          field: "laneLabel",
          // type: "nominal",
          axis: {
            title: null,
            grid: false,
            tickSize: 32,
            domainWidth: 0,
            tickColor: "transparent",
          },
          sort: {
            field: "laneLabel",
            order: "ascending",
          },
        };
        vlSpec.layer = [
          {
            // data: { name: "lines" },
            mark: { type: "line" },
            encoding: {
              x: {
                field: "groupStartDate",
                type: "temporal",
                // axis: false,
              },
              detail: {
                field: "laneLabel",
                type: "nominal",
              },
              y: {
                field: "laneLabel",
                type: "nominal",
                // axis: false,
              },
              strokeWidth: { value: 2 },
              strokeOpacity: { value: 0.54 },
              color:
                (laneField === colourByDataField)
                  ?
                  {
                    field: "colour",
                    scale: null,
                  }
                  :
                  { value: "#c2c2c2" },
            },
          },
          {
            // data: vlSpec.data,
            encoding: vlSpec.encoding,
            mark: vlSpec.mark,
          },
        ];
        // vlSpec.data = undefined;
        vlSpec.encoding = undefined;
        vlSpec.mark = undefined;
      }
    }

    const vgSpec = vegaLiteToVega(vlSpec);

    return vgSpec;
  },
);

export default chartSpecSelector;
