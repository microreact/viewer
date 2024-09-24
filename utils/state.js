/* eslint no-plusplus: 0 */
/* eslint prefer-rest-params: 0 */
/* eslint-disable prefer-object-spread */
/* eslint-disable prefer-spread */

import { connect } from "react-redux";
import createCachedSelector from "re-reselect";
import { emptyObject } from "../constants";

const selectors = [];

export function clearCache() {
  for (const selector of selectors) {
    if (selector.clearCache) {
      selector.clearCache();
    }
  }
}

export function createCombinedStateSelector(stateKeysSelector, baseSelector, resultFunc) {
  let lastArgs = null;
  let lastResult = null;

  const selector = function (state, stateId) {
    const rawKeys = stateKeysSelector(state, stateId);
    const keys = Array.isArray(rawKeys) ? rawKeys : Object.keys(rawKeys);
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
      lastResult = resultFunc.call(null, args, keys);
    }

    lastArgs = args;

    return lastResult;
  };
  return selector;
}

export const presentStateSelector = (rootState) => rootState.present;

export const getPresentState = presentStateSelector;

const keySelector = (_, stateId) => {
  if (!stateId) {
    throw new Error("Invalid state key");
  }
  return stateId;
};

export function createKeyedStateSelector() {
  const baseSelector = createCachedSelector.apply(null, arguments);
  const selector = baseSelector(keySelector);
  selectors.push(selector);
  return selector;
}

export function newId(state, prefix, ignoreKeys) {
  let index = 0;
  let newKey;
  const allKeys = Object.keys(state);
  if (ignoreKeys) {
    for (const key of ignoreKeys) {
      allKeys.push(key);
    }
  }
  do {
    index++;
    newKey = `${prefix}-${index}`;
  }
  while (allKeys.includes(newKey));

  return newKey;
}

export function updateKeyedState(state, stateId, updater) {
  const nextState = { ...(state || emptyObject) };
  nextState[stateId] = {
    ...(nextState[stateId] || emptyObject),
    ...updater,
  };
  return nextState;
}

export function removeKeyedState(state, stateId) {
  const nextState = { ...state };
  nextState[stateId] = undefined;
  delete nextState[stateId];
  return nextState;
}

export function replaceKeyedState(state, stateId, updater) {
  const nextState = { ...state };
  nextState[stateId] = updater;
  return nextState;
}

export function updateAll(state, updater) {
  const nextState = Object.assign(
    {},
    state
  );
  for (const stateId of Object.keys(state)) {
    nextState[stateId] = Object.assign(
      {},
      state[stateId],
      updater
    );
  }
  return nextState;
}

// TODO: add areStatesEqual https://react-redux.js.org/api/connect#arestatesequal-next-object-prev-object-nextownprops-object-prevownprops-object--boolean
export function connectToPresentState(
  component,
  mapStateToProps,
  mapDispatchToProps,
) {
  return connect(
    mapStateToProps ? (state, props) => mapStateToProps(state.present, props) : null,
    mapDispatchToProps,
  )(
    component
  );
}

export function connectToPresentStateWithRef(
  component,
  mapStateToProps,
  mapDispatchToProps,
) {
  return connect(
    mapStateToProps ? (state, props) => mapStateToProps(state.present, props) : null,
    mapDispatchToProps,
    null,
    { forwardRef: true },
  )(
    component
  );
}
