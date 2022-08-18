import { createKeyedStateSelector } from "../../utils/state";
import baseGraphSelector from "./base-graph";

const originalLayoutSelector = createKeyedStateSelector(
  (state, networkId) => baseGraphSelector(state, networkId),
  (
    parsedData,
  ) => {
    if (parsedData === null) {
      return null;
    }
    const layout = {};
    for (const node of parsedData.nodes) {
      if (node.x && node.y) {
        layout[node.id] = node;
      } else {
        return null;
      }
    }
    return layout;
  },
);

export default originalLayoutSelector;
