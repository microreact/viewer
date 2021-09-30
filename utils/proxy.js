/* eslint-disable no-undef-init */

let fetcherFunction = undefined;

export function setFetcher(fetcher) {
  fetcherFunction = fetcher;
}

export function getFetcher() {
  return fetcherFunction || undefined;
}
