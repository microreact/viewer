import { createCombinedStateSelector, createKeyedStateSelector } from "../../utils/state";
import { intersect } from "../../utils/sets";
import { isPointInPolygon } from "../../utils/geometry";

import layoutSelector from "../networks/layout";
import rowsByNodeIdSelector from "../networks/rows-by-node-id";

const nodeIdsSelector = createKeyedStateSelector(
  (state, networkId) => layoutSelector(state, networkId),
  (state, networkId) => state.networks[networkId].path,
  (
    layout,
    path,
  ) => {
    if (layout === null || path === null) {
      return undefined;
    }

    const ids = new Set();
    for (const nodeId of Object.keys(layout)) {
      const point = layout[nodeId];
      if ((point.x !== undefined) && (point.y !== undefined) && isPointInPolygon(point, path)) {
        ids.add(nodeId);
      }
    }

    return ids;
  },
);

const networkIdsSelector = createKeyedStateSelector(
  (state, networkId) => nodeIdsSelector(state, networkId),
  (state, networkId) => rowsByNodeIdSelector(state, networkId),
  (
    nodeIds,
    rowsByNodeId,
  ) => {
    if (nodeIds) {
      const ids = new Set();
      for (const nodeId of nodeIds) {
        const rows = rowsByNodeId.get(nodeId);
        if (rows) {
          for (const row of rows) {
            ids.add(row[0]);
          }
        }
      }
      return ids;
    }
    else {
      return undefined;
    }
  },
);

const filteredNetworkIdsSelector = createCombinedStateSelector(
  (state) => state.networks,
  networkIdsSelector,
  (sets) => {
    return intersect(sets.filter((x) => x !== undefined));
  },
);

export default filteredNetworkIdsSelector;
