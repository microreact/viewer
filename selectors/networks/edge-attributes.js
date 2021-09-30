import { createKeyedStateSelector } from "../../utils/state";

import baseGraphSelector from "./base-graph";

export const anyPostfix = /^(.*)__(colour|color|linewidth|linestyle)$/i;

const edgeAttributesSelector = createKeyedStateSelector(
  (state, networkId) => baseGraphSelector(state, networkId),
  (
    graph,
  ) => {
    const attributes = new Set();

    for (const edge of graph.edges) {
      for (const key of Object.keys(edge)) {
        if (
          key !== "id" &&
          key !== "from" &&
          key !== "to" &&
          key !== "arrows" &&
          key !== "arrowStrikethrough"
        ) {
          attributes.add(key);
        }
      }
    }

    const fields = [];
    for (const key of attributes) {
      const match = key.match(anyPostfix);
      fields.push({
        name: key,
        label: (match !== null ? match[1] : key).replace(/_/g, " "),
      });
    }

    return fields;
  },
);

export default edgeAttributesSelector;
