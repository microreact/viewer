import { Newick as newickParser } from "@phylocanvas/phylocanvas.gl";

export function labelsToRowIds(
  labels,
  rowsByLabel,
) {
  const ids = new Set();
  for (const label of labels) {
    for (const row of (rowsByLabel.get(label) || [])) {
      ids.add(row[0]);
    }
  }
  return ids;
}

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
