import { createKeyedStateSelector } from "../../utils/state";
import { isVegaLiteSpec, vegaLiteToVega } from "../../utils/charts";

import chartStateSelector from "./chart-state";
import defaultSpecSelector from "./default-spec";
import heatmapSpecSelector from "./heatmap-spec";
import chartTypeSelector from "./chart-type";
import paneSizeSelector from "../panes/pane-size";

const customChartSpecSelector = createKeyedStateSelector(
  (state, chartId) => chartStateSelector(state, chartId).spec,
  (
    spec,
  ) => {
    if (spec) {
      const vlSpec = JSON.parse(spec);
      return vlSpec;
    }
    else {
      return undefined;
    }
  },
);

const vegaLiteSpecSelector = (state, chartId) => {
  const chartType = chartTypeSelector(state, chartId);

  if (chartType === "custom") {
    return customChartSpecSelector(state, chartId);
  }

  if (chartType === "heatmap") {
    return heatmapSpecSelector(state, chartId);
  }

  if (chartType) {
    return defaultSpecSelector(state, chartId);
  }

  return undefined;
};

// TODO: move this chart panel
const vegaSpecSelector = createKeyedStateSelector(
  (state, chartId) => vegaLiteSpecSelector(state, chartId),
  (state, chartId) => paneSizeSelector(state, chartId),
  (
    spec,
    size,
  ) => {
    if (!spec) {
      return undefined;
    }

    const vlSpec = {
      ...spec,
    };

    if (isVegaLiteSpec(vlSpec)) {
      vlSpec.data = { name: "table" };
    }
    else if (!vlSpec.data) {
      vlSpec.data = [ { name: "table" } ];
    }

    if (!vlSpec.padding) {
      vlSpec.padding = { left: 8, top: 32, right: 8, bottom: 8 };
    }

    if (vlSpec.width === "auto") {
      vlSpec.width = size.width;
    }
    if (vlSpec.height === "auto") {
      vlSpec.height = size.height;
    }

    const vgSpec = vegaLiteToVega(vlSpec);

    return vgSpec;
  }
);

export default vegaSpecSelector;
