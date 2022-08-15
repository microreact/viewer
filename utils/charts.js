import { compile } from "vega-lite";
import LZString from "lz-string";

const vegaEditorDataUrlRegex = /https:\/\/vega\.github\.io\/editor\/#\/url\/vega(?:-lite)?\/(.*)/i;

export function dataFieldToAxisType(dataColumn) {
  if (dataColumn) {
    switch (dataColumn.dataType) {
      case "integer":
      case "real":
      case "percent":
      case "number":
        return "quantitative";

      case "date":
      case "timestamp":
        return "temporal";

      default:
        return "nominal";
    }
  }
  else {
    return undefined;
  }
}

async function getView(vega) {
  const result = await vega.vegaEmbed.current.resultPromise;
  return result.view;
}

export async function exportPNG(vega) {
  const view = await getView(vega);
  const dataUrl = await view.toImageURL("png");
  return dataUrl;
}

export async function exportSVG(vega) {
  const view = await getView(vega);
  const dataUrl = await view.toSVG();
  return dataUrl;
}

export function isVegaLiteSpec(vlSpec) {
  return vlSpec.$schema && vlSpec.$schema.startsWith("https://vega.github.io/schema/vega-lite");
}

export function vegaLiteToVega(vlSpec) {
  let vgSpec;

  if (isVegaLiteSpec(vlSpec)) {
    try {
      vgSpec = compile(vlSpec, {}).spec;

      vgSpec.signals = [
        ...(vgSpec.signals || []),
        // {
        //   name: 'tooltip',
        //   value: {},
        //   on: [
        //     { events: 'rect:mousedown', update: 'datum' },
        //   ],
        // },
        {
          name: "onItemSelect",
          value: {},
          on: [
            { events: "click", update: "[ event, datum ]" },
          ],
        },
      ];
    }
    catch (error) {
      console.error(vgSpec, vlSpec);
      return error;
    }
  }
  else {
    vgSpec = vlSpec;
  }

  return vgSpec;
}

export function vegaEditorDataUrlToSpec(value) {
  const match = value?.match(vegaEditorDataUrlRegex);
  if (match && match[1]) {
    return LZString.decompressFromEncodedURIComponent(match[1]);
  }
  else {
    return undefined;
  }
}

export function vegaEditorSpecToDataUrl(specString) {
  const serializedSpec = LZString.compressToEncodedURIComponent(specString);
  const url = `https://vega.github.io/editor#/url/vega-lite/${serializedSpec}`;
  return url;
}
