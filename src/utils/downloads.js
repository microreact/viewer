import download from "downloadjs";

// const windowURL = window.URL || window.webkitURL;

// function generateObjectUrl(type, data) {
//   if (data instanceof Blob) {
//     return windowURL.createObjectURL(data);
//   }

//   if (type === "svg") {
//     return windowURL.createObjectURL(
//       new Blob(
//         [ data ],
//         { type: "image/svg+xml" }
//       )
//     );
//   }
//   if (type === "txt" || type === "nwk") {
//     return windowURL.createObjectURL(
//       new Blob(
//         [ data ],
//         { type: "text/plain;charset=utf-8" }
//       )
//     );
//   }
//   if (type === "microreact") {
//     return windowURL.createObjectURL(
//       new Blob(
//         [ data ],
//         { type: "application/json" }
//       )
//     );
//   }
//   else {
//     return data;
//   }
// }

export const downloadDataUrl = download;

// export function downloadDataUrl(data, filename, type) {
//   const anchor = document.createElement("a");
//   if (typeof anchor.download !== "undefined") {
//     anchor.download = `microreact-${filename}.${type}`;
//     const url = generateObjectUrl(type, data);
//     anchor.href = url;
//     document.body.appendChild(anchor);
//     anchor.click();
//     document.body.removeChild(anchor);
//     windowURL.revokeObjectURL(url);
//   }
//   else if (type === "png") {
//     document.location.href = data.replace("data:image/png", "image/octet-stream");
//   }
//   else {
//     const url = generateObjectUrl(type, data);
//     document.location.href = url;
//     windowURL.revokeObjectURL(url);
//   }
// }

export function openUrl(url) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

// export function addExportCallback(key, callback) {
//   exportFunctions[key] = callback;
// }

// export function removeExportCallback(key) {
//   exportFunctions[key] = undefined;
// }

// export function resetExportCallbacks() {
//   exportFunctions = {};
// }

// export function exportFile(key, filename, download = true) {
//   if (typeof (exportFunctions[key]) === "function") {
//     return Promise.resolve(filename)
//       .then(exportFunctions[key])
//       .then((dataUrl) => {
//         if (download) {
//           const [ , type ] = key.split("-");
//           downloadDataUrl(dataUrl, filename, type);
//         }
//         return dataUrl;
//       });
//   } else {
//     throw new Error(`Invalid export type: ${key}`);
//   }
// }
