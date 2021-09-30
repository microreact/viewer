/* eslint prefer-rest-params: 0 */
/* eslint no-plusplus: 0 */

export function createCombinedSelector(stateKeysSelector, baseSelector, resultFunc) {
  let lastArgs = null;
  let lastResult = null;

  const selector = function (state) {
    const keys = Object.keys(stateKeysSelector(state));
    const args = [];

    for (let i = 0; i < keys.length; i++) {
      args.push(baseSelector(state, keys[i]));
    }

    let recompute = false;
    if (lastArgs === null || lastArgs.length !== args.length) {
      recompute = true;
    }
    else {
      for (let i = 0; i < args.length; i++) {
        if ((lastArgs[i] !== args[i])) {
          recompute = true;
          break;
        }
      }
    }

    if (recompute) {
      lastResult = resultFunc.call(null, args);
    }

    lastArgs = args;

    return lastResult;
  };
  return selector;
}

export function newId(state, prefix) {
  let index = 0;
  let newKey;
  const allKeys = Object.keys(state);
  do {
    index++;
    newKey = `${prefix}-${index}`;
  }
  while (allKeys.includes(newKey));

  return newKey;
}
