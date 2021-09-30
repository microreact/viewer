import dotparser from "vis/lib/network/dotparser";
import C2S from "canvas2svg";

const layers = [ "scene", "mouse", "lasso" ];

export function graphLabels(source) {
  const parsedData = dotparser.DOTToGraph(source);
  const labels = [];

  for (const node of parsedData.nodes) {
    labels.push(node.id.toString());
  }

  return labels;
}

export function exportPNG(sigma) {
  const renderer = sigma.renderers[0];

  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", `${renderer.width}px`);
  canvas.setAttribute("height", `${renderer.height}px`);

  const ctx = canvas.getContext("2d");
  for (const id of layers) {
    if (id in renderer.domElements) {
      ctx.drawImage(renderer.domElements[id], 0, 0);
    }
  }

  return canvas.toDataURL();
}

export function exportSVG(sigma) {
  const renderer = sigma.renderers[0];

  const originalCtxs = {};

  const svgCtx = new C2S(renderer.width, renderer.height);

  svgCtx.clearRect = () => {};

  for (const id of Object.keys(renderer.contexts)) {
    originalCtxs[id] = renderer.contexts[id];
    renderer.contexts[id] = svgCtx;
  }

  sigma.refresh();

  for (const id of Object.keys(originalCtxs)) {
    renderer.contexts[id] = originalCtxs[id];
  }

  return svgCtx.getSerializedSvg(false);
}
