import html2canvas from "html2canvas";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const XHTML_NAMESPACE = "http://www.w3.org/1999/xhtml";

function copyComputedStyles(sourceElement, targetElement) {
  if (!targetElement) {
    return;
  }

  const computedStyle = window.getComputedStyle(sourceElement);
  const styles = [];

  for (let index = 0; index < computedStyle.length; index++) {
    const propertyName = computedStyle.item(index);
    const propertyValue = computedStyle.getPropertyValue(propertyName);
    const priority = computedStyle.getPropertyPriority(propertyName);

    if (propertyValue) {
      styles.push(
        `${propertyName}: ${propertyValue}${priority ? ` !${priority}` : ""};`,
      );
    }
  }

  targetElement.setAttribute("style", styles.join(" "));

  if (sourceElement instanceof HTMLInputElement) {
    targetElement.setAttribute("value", sourceElement.value);
  }

  if (sourceElement instanceof HTMLTextAreaElement) {
    targetElement.textContent = sourceElement.value;
  }

  for (let index = 0; index < sourceElement.children.length; index++) {
    copyComputedStyles(
      sourceElement.children[index],
      targetElement.children[index],
    );
  }
}

export function exportHtmlElementAsSvg(domElement) {
  const bounds = domElement.getBoundingClientRect();
  const width = Math.max(
    1,
    Math.ceil(bounds.width || domElement.offsetWidth || domElement.scrollWidth),
  );
  const height = Math.max(
    1,
    Math.ceil(bounds.height || domElement.offsetHeight || domElement.scrollHeight),
  );
  const clone = domElement.cloneNode(true);

  clone.setAttribute("xmlns", XHTML_NAMESPACE);
  copyComputedStyles(domElement, clone);

  const svg = document.createElementNS(SVG_NAMESPACE, "svg");
  svg.setAttribute("xmlns", SVG_NAMESPACE);
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  const foreignObject = document.createElementNS(SVG_NAMESPACE, "foreignObject");
  foreignObject.setAttribute("width", "100%");
  foreignObject.setAttribute("height", "100%");
  foreignObject.appendChild(clone);

  svg.appendChild(foreignObject);

  return new XMLSerializer().serializeToString(svg);
}

export function exportHtmlElementAsDataUrl(
  domElement,
  resize = false,
) {
  const html2canvasConfig = { useCORS: true };
  if (resize) {
    html2canvasConfig.width = window.innerWidth - (document.querySelector(".mr-views-pane")?.getBoundingClientRect().width || 0);
  }
  return Promise.resolve()
    .then(
      () => html2canvas(
        domElement,
        html2canvasConfig,
      )
    )
    .then(
      (canvas) => {
        try {
          if (resize) {
            const thumbnailCanvas = document.createElement("canvas");
            let width = 240;
            let height = 240;
            if (canvas.width > canvas.height) {
              height = canvas.height * (width / canvas.width);
            }
            if (canvas.height > canvas.width) {
              width = canvas.width * (height / canvas.height);
            }
            thumbnailCanvas.setAttribute("width", width);
            thumbnailCanvas.setAttribute("height", height);
            const ctx = thumbnailCanvas.getContext("2d");
            ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height);
            return thumbnailCanvas.toDataURL();
          }
          else {
            return canvas.toDataURL();
          }
        }
        catch (err) {
          console.error("Error exporting HTML element as image:", err);
          return null;
        }
      }
    );
}

export function getContainerElement() {
  return document.querySelector("#microreact-viewer");
}

export function canvasPixelRatio(ctx) {
  const backingStorePixelRatio = (
    ctx.backingStorePixelRatio ||
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    1
  );
  return (window.devicePixelRatio || 1) / backingStorePixelRatio;
}

// export function exportCanvasesAsDataUrl(size, canvases) {
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");
//   const resolution = canvasPixelRatio(ctx);
//   canvas.setAttribute("width", `${size.width * resolution}px`);
//   canvas.setAttribute("height", `${size.height * resolution}px`);
//   for (const layer of canvases) {
//     ctx.globalAlpha = 1.0;
//     ctx.drawImage(layer, 0, 0);
//   }
//   return canvas.toDataURL();
// }
