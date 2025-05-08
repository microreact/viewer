import { createKeyedStateSelector } from "../../utils/state";
import { vegaLiteToVega } from "../../utils/charts";

import configSelector from "../config";
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
  (state) => configSelector(state).theme.fonts.body,
  (state) => coloursDataColumnSelector(state),
  (
    unit,
    style,
    nodeSize,
    laneField,
    size,
    fontFamily,
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
        background: "transparent",
        axis: {
          labelFont: fontFamily,
          labelFontSize: 11,
        },
        view: {
          stroke: "transparent",
        },
      },
      data: { name: "dataset" },
      mark: "bar",
      encoding: {
        x: {
          field: "unitStartDate",
          type: "temporal",
          axis: {
            title: null,
            grid: false,
          },
        },

        x2: {
          field: "unitEndDate",
          type: "temporal",
          axis: null,
          grid: false,
        },

        y: {
          aggregate: "sum",
          field: "groupCount",
          type: "quantitative",
          axis: {
            title: null,
          },
        },

        color: {
          field: "groupColour",
          scale: null,
        },

        fillOpacity: {
          field: "isSelected",
          scale: {
            domain: [false, true],
            range: [0.14, 1],
          },
          legend: false,
        },

        tooltip: [
          {
            field: "unitLabel",
            type: "nominal",
            title: unit,
          },
          {
            field: "unitCount",
            type: "quantitative",
            title: "unitCount",
          },
          {
            field: "groupLabel",
            type: "nominal",
            title: colourByDataField.name,
          },
          {
            field: "groupCount",
            type: "quantitative",
            title: "groupCount",
          },
        ],
      },
      height: Math.max(136, size.height) - 48 - 8,
      padding: { left: 16, top: 32, right: 16, bottom: 2 },

      width: size.width - 16,
    };

    if (style === "normalised-bar") {
      vlSpec.encoding.y.stack = "normalize";
    }

    const vgSpec = vegaLiteToVega(vlSpec);

    return vgSpec;
  },
);

export default chartSpecSelector;
