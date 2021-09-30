import dotparser from "vis/lib/network/dotparser";

import { createKeyedStateSelector } from "../../utils/state";
import networkFileSelector from "./network-file";

const baseGraphSelector = createKeyedStateSelector(
  (state, networkId) => networkFileSelector(state, networkId)?._content,
  (
    dotString,
  ) => {
    if (!dotString) {
      return null;
    }
    const parsedData = dotparser.DOTToGraph(dotString);
    for (const node of parsedData.nodes) {
      node.id = node.id.toString();
      if (node.pos) {
        const pos = node.pos.split(",");
        if (pos.length === 2) {
          node.x = pos[0];
          node.y = pos[1];
        }
      }
      if (node.x && node.y) {
        node.x = parseFloat(node.x);
        node.y = parseFloat(node.y);
        node.fixed = true;
      }
    }
    let index = 0;
    for (const edge of parsedData.edges) {
      edge.arrowStrikethrough = false;
      edge.id = edge.id || `edge-${index++}`;
    }
    return parsedData;
  },
);

export default baseGraphSelector;
