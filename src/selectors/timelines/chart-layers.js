import { LineLayer } from "@deck.gl/layers";

import { createKeyedStateSelector } from "../../utils/state";

import chartDataSelector from "./chart-data";

const chartLayersSelector = createKeyedStateSelector(
  (state, timelineId) => chartDataSelector(state, timelineId),
  (
    data,
  ) => {
    const layers = [
      new LineLayer({
        id: "line-layer",
        data,
        getSourcePosition: (datum) => [ datum.x0, 0 ],
        getTargetPosition: (datum) => [ datum.x1, datum.groupCount ],
      }),
    ];
    return layers;
  },
);

export default chartLayersSelector;
