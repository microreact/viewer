import { createKeyedStateSelector } from "../../utils/state";

import chartStateSelector from "./chart-state";
import chartTypeSelector from "./chart-type";
import paneSizeSelector from "../panes/pane-size";
import idFieldNameSelector from "../datasets/id-field-name";

const defaultSpecSelector = createKeyedStateSelector(
  (state, chartId) => chartTypeSelector(state, chartId),
  (state, chartId) => chartStateSelector(state, chartId).columns,
  (state, chartId) => idFieldNameSelector(state, chartId),
  (
    chartType,
    columns,
    idFieldName,
  ) => {
    const vlSpec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
      "transform": [
        {
          "fold": columns,
        },
      ],
      "mark": "rect",
      "encoding": {
        "x": {
          "field": idFieldName,
          "type": "nominal",
          "axis": {
            "title": null,
          },
        },
        "y": {
          "field": "key",
          "type": "nominal",
          "axis": {
            "title": null,
          },
        },
        "color": {
          "field": "value",
          "type": "quantitative",
          "scale": {
            // "domain": [
            //   0,
            //   31,
            // ],
            "scheme": "viridis",
            "type": "linear",
          },
          "legend": {
            "title": null,
          },
        },
      },
      "config": {
        "view": {
          "stroke": "transparent",
        },
      },
    };
    return vlSpec;
  },
);

const vlSpecSelector = createKeyedStateSelector(
  (state, chartId) => defaultSpecSelector(state, chartId),
  (state, chartId) => paneSizeSelector(state, chartId),
  (
    vlSpec,
    size,
  ) => {
    if (vlSpec) {
      vlSpec.bounds = "flush";
      vlSpec.autosize = {
        type: "fit",
        contains: "padding",
      };

      // vlSpec.width = size.width;
      // vlSpec.height = size.height;

      return { ...vlSpec };
    }

    return vlSpec;
  }
);

export default vlSpecSelector;
