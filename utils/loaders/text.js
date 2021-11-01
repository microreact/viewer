import { loadInBatches } from "@loaders.gl/core";

import { getFetcher } from "../proxy";

const arrayBufferAsText = (arrayBuffer) => (new TextDecoder().decode(arrayBuffer));

const TextLoader = {
  name: "TEXT",
  extension: "txt",
  extensions: [ "txt" ],
  testText: null,
  parse: async (arrayBuffer) => arrayBufferAsText(arrayBuffer),
  parseSync: arrayBufferAsText,
  parseTextSync: (x) => x,
  async* parseInBatches(asyncIterator, options) {
    for await (const batch of asyncIterator) {
      yield arrayBufferAsText(batch);
    }
  },
};

// export async function loadTextFile(input) {
//   const data = await load(
//     input,
//     TextLoader,
//     {
//       fetch: getFetcher(),
//     },
//   );
//   return data;
// }

export async function loadTextFile(fileBlobOrUrl, settings, onProgress) {
  const loaderOptions = {
    fetch: getFetcher(),
  };

  const data = [];
  let bytesUsed = 0;

  for await (const batch of await loadInBatches(fileBlobOrUrl, TextLoader, loaderOptions)) {
    data.push(batch);
    bytesUsed += batch.length;
    onProgress && onProgress(bytesUsed);
  }

  return data.join("");
}
