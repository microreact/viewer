import { createKeyedStateSelector } from "../../utils/state";
import { vegaLiteToVega } from "../../utils/charts";

import chartStateSelector from "./chart-state";
import defaultSpecSelector from "./default-spec";
import chartTypeSelector from "./chart-type";

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

  if (chartType) {
    return defaultSpecSelector(state, chartId);
  }

  return undefined;
};

const vegaSpecSelector = createKeyedStateSelector(
  (state, chartId) => vegaLiteSpecSelector(state, chartId),
  (
    spec,
  ) => {
    if (!spec) {
      return undefined;
    }

    const vlSpec = {
      ...spec,
      padding: { left: 8, top: 32, right: 8, bottom: 8 },
      data: { name: "table" },
    };

    const vgSpec = vegaLiteToVega(vlSpec);

    return vgSpec;
  }
);

export default vegaSpecSelector;
