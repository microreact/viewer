import { Newick as newickParser } from "@phylocanvas/phylocanvas.gl";

export function newickLabels(source) {
  const rootNode = newickParser.parse_newick(source);

  const queue = [ rootNode ];
  const labels = [];

  while (queue.length) {
    const node = queue.shift();
    if (node.children) {
      for (const childNode of node.children) {
        queue.push(childNode);
      }
    }
    else if (node.name) {
      labels.push(node.name.replace(/^'|'$|^"|"$/g, ""));
    }
  }

  return labels;
}
