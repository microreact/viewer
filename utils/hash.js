// import shortUUID from "short-uuid";

/**
 * Generates a hash string of specified length
 * @param {number} count
 * @returns {string} hash string
 */
export function generateHashId(count = 4) {
  return (
    Math.random()
      .toString(36)
      .substr(2, count)
  );
}

// export function generateUUID() {
//   return shortUUID.generate();
// }

export function generateUniqueName(allNames, name) {
  let uniqueName = name;
  let postfix = 1;

  while (allNames.has(uniqueName)) {
    uniqueName = `${name}-${postfix}`;
    postfix += 1;
  }

  return uniqueName;
}
