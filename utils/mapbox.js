const MAPBOX_API_URL = "https://api.mapbox.com";
const MAPBOX_PROTOCOL = "mapbox://";
const MAPBOX_STYLES_PROTOCOL = `${MAPBOX_PROTOCOL}styles/`;
const MAPBOX_SPRITES_PROTOCOL = `${MAPBOX_PROTOCOL}sprites/`;
const MAPBOX_FONTS_PROTOCOL = `${MAPBOX_PROTOCOL}fonts/`;
const MAPBOX_TILES_PROTOCOL = `${MAPBOX_PROTOCOL}tiles/`;
const MAPBOX_RASTER_PROTOCOL = `${MAPBOX_PROTOCOL}raster/`;
const mapboxHttpUrlPattern = /^https?:\/\/([^/]+\.)?mapbox\.com\//i;

function splitUrl(url) {
  const queryIndex = url.indexOf("?");
  if (queryIndex === -1) {
    return { path: url, query: "" };
  }
  return {
    path: url.slice(0, queryIndex),
    query: url.slice(queryIndex + 1),
  };
}

function appendQuery(url, query) {
  if (!query) {
    return url;
  }
  return `${url}${url.includes("?") ? "&" : "?"}${query}`;
}

function appendAccessToken(url, accessToken) {
  if (!accessToken || /(?:[?&])access_token=/.test(url)) {
    return url;
  }
  return appendQuery(url, `access_token=${encodeURIComponent(accessToken)}`);
}

function encodePathPart(part) {
  try {
    return encodeURIComponent(decodeURIComponent(part)).replace(/%2C/g, ",");
  }
  catch (error) {
    return encodeURIComponent(part).replace(/%2C/g, ",");
  }
}

function encodePath(path) {
  return path
    .split("/")
    .map(encodePathPart)
    .join("/");
}

export function isMapboxStyleUrl(url) {
  return typeof url === "string" && url.startsWith(MAPBOX_STYLES_PROTOCOL);
}

function transformMapboxStyleUrl(url) {
  const { path, query } = splitUrl(url.slice(MAPBOX_STYLES_PROTOCOL.length));
  const [ owner, ...styleParts ] = path.split("/");

  if (!owner || !styleParts.length) {
    return url;
  }

  return appendQuery(
    `${MAPBOX_API_URL}/styles/v1/${encodePathPart(owner)}/${encodePath(styleParts.join("/"))}`,
    query,
  );
}

function transformMapboxSpriteUrl(url) {
  const { path, query } = splitUrl(url.slice(MAPBOX_SPRITES_PROTOCOL.length));
  const [ owner, ...styleParts ] = path.split("/");

  if (!owner || !styleParts.length) {
    return url;
  }

  const stylePath = styleParts.join("/");
  const spriteSuffix = stylePath.match(/(@2x)?\.(json|png)$/)?.[0] || "";
  const styleId = spriteSuffix ? stylePath.slice(0, -spriteSuffix.length) : stylePath;

  return appendQuery(
    `${MAPBOX_API_URL}/styles/v1/${encodePathPart(owner)}/${encodePath(styleId)}/sprite${spriteSuffix}`,
    query,
  );
}

function transformMapboxFontsUrl(url) {
  const { path, query } = splitUrl(url.slice(MAPBOX_FONTS_PROTOCOL.length));
  const [ owner, fontstack, ...rangeParts ] = path.split("/");

  if (!owner || !fontstack || !rangeParts.length) {
    return url;
  }

  return appendQuery(
    `${MAPBOX_API_URL}/fonts/v1/${encodePathPart(owner)}/${encodePathPart(fontstack)}/${encodePath(rangeParts.join("/"))}`,
    query,
  );
}

function transformMapboxSourceUrl(url) {
  const { path, query } = splitUrl(url.slice(MAPBOX_PROTOCOL.length));
  const tileJsonPath = path.endsWith(".json") ? path : `${path}.json`;

  return appendQuery(
    appendQuery(
      `${MAPBOX_API_URL}/v4/${encodePath(tileJsonPath)}`,
      query,
    ),
    "secure",
  );
}

function transformMapboxTileUrl(url, prefix) {
  const { path, query } = splitUrl(url.slice(prefix.length));
  const apiPrefix = prefix === MAPBOX_RASTER_PROTOCOL ? "raster/v1" : "v4";

  return appendQuery(
    `${MAPBOX_API_URL}/${apiPrefix}/${encodePath(path)}`,
    query,
  );
}

export function transformMapboxUrl(url, accessToken) {
  if (typeof url !== "string") {
    return url;
  }

  let nextUrl = url;

  if (url.startsWith(MAPBOX_STYLES_PROTOCOL)) {
    nextUrl = transformMapboxStyleUrl(url);
  }
  else if (url.startsWith(MAPBOX_SPRITES_PROTOCOL)) {
    nextUrl = transformMapboxSpriteUrl(url);
  }
  else if (url.startsWith(MAPBOX_FONTS_PROTOCOL)) {
    nextUrl = transformMapboxFontsUrl(url);
  }
  else if (url.startsWith(MAPBOX_TILES_PROTOCOL)) {
    nextUrl = transformMapboxTileUrl(url, MAPBOX_TILES_PROTOCOL);
  }
  else if (url.startsWith(MAPBOX_RASTER_PROTOCOL)) {
    nextUrl = transformMapboxTileUrl(url, MAPBOX_RASTER_PROTOCOL);
  }
  else if (url.startsWith(MAPBOX_PROTOCOL)) {
    nextUrl = transformMapboxSourceUrl(url);
  }
  else if (!mapboxHttpUrlPattern.test(url)) {
    return url;
  }

  return appendAccessToken(nextUrl, accessToken);
}

export function createMapboxRequestTransform(accessToken) {
  return (url) => ({
    url: transformMapboxUrl(url, accessToken),
  });
}
