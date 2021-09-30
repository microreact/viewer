import { createKeyedStateSelector } from "../../utils/state";

import baseGraphSelector from "./base-graph";

import defaults from "../../defaults";

const edgeStylesSelector = createKeyedStateSelector(
  (state, networkId) => baseGraphSelector(state, networkId),
  // edgeLabelAttributesSelector,
  (state, networkId) => state.networks[networkId].edgeColourFilter,
  (state, networkId) => state.networks[networkId].edgeLabelFilter,
  (state, networkId) => state.networks[networkId].edgeLineStyleFilter,
  (state, networkId) => state.networks[networkId].edgeLineWidthFilter,
  (
    graph,
    // edgeLabelFilters,
    edgeColourFilter,
    edgeLabelFilter,
    edgeLineStyleFilter,
    edgeLineWidthFilter,
  ) => {
    const edgeStyles = {};

    for (const edge of graph.edges) {
      const style = {};

      style.colour = edge[edgeColourFilter] || defaults.COLOUR_DARK;

      style.label = edge[edgeLabelFilter] || undefined;

      style.line = edge[edgeLineStyleFilter] || "solid";

      style.width = edge[edgeLineWidthFilter] || 1;

      // const title = [ `From: ${edge.from} To: (${edge.to})` ];
      // for (const { label, field } of edgeLabelFilters) {
      //   title.push(`${label}: ${edge[field]}`);
      // }
      // style.title = title.join('. ');

      edgeStyles[edge.id] = style;
    }

    return edgeStyles;
  },
);

export default edgeStylesSelector;
