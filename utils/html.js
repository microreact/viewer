import html2canvas from "html2canvas";

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
