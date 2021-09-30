import queryString from "query-string";
import slugify from "slugify";

export function isMac() {
  return (
    (typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0)
  );
}

export function nextTick(callback, delay = 0) {
  setTimeout(
    callback,
    delay,
  );
}

export function nextFrame(callback, delay = 16) {
  setTimeout(
    callback,
    delay,
  );
}

export function nextAnimation(callback, delay = 200) {
  setTimeout(
    callback,
    delay,
  );
}

export function triggerWindowResize(delay = 0) {
  setTimeout(
    () => window.dispatchEvent(new Event("resize")),
    delay,
  );
}

// export function triggerEvent(element, event, delay = 0) {
//   setTimeout(
//     () => element.dispatchEvent(new Event(event)),
//     delay,
//   );
// }

export function changeLocation(path) {
  window.history.pushState(null, null, path);
}

export function pageUrl(url) {
  return new URL(window.location);
}

export function getPageHash() {
  if (window?.location?.hash) {
    return window.location.hash.substr(1, 4);
  }
  else {
    return undefined;
  }
}

export function parseQueryString(url) {
  return queryString.parse(new URL(url).search);
}

export function setPageHash(id, title) {
  let hash = id;

  if (title) {
    const slug = slugify(
      title,
      {
        lower: true,
        strict: true,
      },
    );
    hash += `-${slug}`;
  }

  window.location.hash = hash;
}
