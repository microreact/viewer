import { load } from "@loaders.gl/core";
import { JSONLoader } from "@loaders.gl/json";

import { getFetcher } from "../proxy";

export function findGeoJSONPropertyNames(geoJson) {
  const properties = new Set();
  for (const feature of geoJson.features) {
    for (const key of Object.keys(feature.properties)) {
      properties.add(key);
    }
  }

  return Array.from(properties);
}

export async function loadJsonFile(fileBlobOrUrl, settings, onProgress) {
  const data = await load(
    fileBlobOrUrl,
    JSONLoader,
    {
      fetch: getFetcher(),
    },
  );
  return data;
}

export async function loadGeoJsonFile(fileBlobOrUrl, settings, onProgress) {
  const data = await loadJsonFile(fileBlobOrUrl, settings, onProgress);
  data.properties = findGeoJSONPropertyNames(data);
  return data;
}

// export async function loadGeoJsonFile(fileBlobOrUrl, settings, onProgress) {
//   const loaderOptions = {
//     fetch: getFetcher(),
//     metadata: true,
//   };

//   let data;

//   for await (const batch of await loadInBatches(fileBlobOrUrl, JSONLoader, loaderOptions)) {
//     // bytesUsed += batch.length;
//     onProgress && onProgress(batch.bytesUsed);
//     if (batch.batchType === "final-result") {
//       data = batch.container;
//     }
//   }

//   findGeoJSONPropertyNames(data);

//   return data;
// }
