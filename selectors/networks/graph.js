import { createKeyedStateSelector } from "../../utils/state";

import selectedIdsSetSelector from "../filters/selected-ids-set";
import filteredIdsSelector from "../filters/filtered-ids";

import baseGraphSelector from "./base-graph";
import edgeStylesSelector from "./edge-styles";
import layoutSelector from "./layout";
import rowsByNodeIdSelector from "./rows-by-node-id";
import rowStylesSelector from "../styles/row-styles";

const graphSelector = createKeyedStateSelector(
  (state, networkId) => baseGraphSelector(state, networkId),
  (state, networkId) => layoutSelector(state, networkId),
  (state) => rowStylesSelector(state),
  (state, networkId) => edgeStylesSelector(state, networkId),
  (state) => filteredIdsSelector(state),
  (state, networkId) => selectedIdsSetSelector(state, networkId),
  (state, networkId) => rowsByNodeIdSelector(state, networkId),
  (state, networkId) => 2 ** state.networks[networkId].scale,
  (
    parsedData,
    layout,
    [ rowStyles ],
    edgeStyles,
    filteredIds,
    highlightedIds,
    rowsByNodeId,
    scale,
  ) => {
    const step = 2 * Math.PI / parsedData.nodes.length;

    const nodes = [];
    for (const node of parsedData.nodes) {
      const i = parsedData.nodes.indexOf(node);

      const nodeRows = rowsByNodeId.get(node.id);
      if (nodeRows) {
        const nodeStyle = rowStyles[nodeRows[0][0]];
        const isActive = (!filteredIds || nodeRows.some((row) => filteredIds.has(row[0])));
        nodes.push({
          id: node.id,
          isActive,
          isHighlighted: highlightedIds.has(node.id),
          label: isActive ? nodeStyle.label : "",
          size: 1,
          style: nodeStyle,
          weight: 1,
          x: (layout ? layout[node.id].x : Math.cos(i * step)) * scale,
          y: (layout ? layout[node.id].y : Math.sin(i * step)) * scale,
        });
      }
    }

    const edges = [];
    for (const edge of parsedData.edges) {
      const fromNodeRows = rowsByNodeId.get(edge.from);
      const toNodeRows = rowsByNodeId.get(edge.to);
      if (fromNodeRows && toNodeRows) {
        edges.push({
          id: edge.id,
          source: edge.from,
          target: edge.to,
          style: edgeStyles[edge.id],
        });
      }
    }

    return { nodes, edges };
  },
);

export default graphSelector;
