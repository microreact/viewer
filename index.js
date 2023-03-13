/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */

import Index from "./containers/Viewer.react";

export { default as Theme } from "./containers/Theme.react";

export { default as store } from "./store";

export { default as defaults } from "./defaults";
export * as constants from "./constants";

import * as uiActions from "./actions/ui";
export const actions = uiActions;
export const mrActions = uiActions;

export * from "./components";

import * as events from "./utils/events";
import * as downloads from "./utils/downloads";
import * as html from "./utils/html";
import * as proxy from "./utils/proxy";
import * as files from "./utils/files";
export const utils = {
  downloads,
  events,
  files,
  html,
  proxy,
};

export * as selectors from "./selectors";

export * as schema from "./schema";

export default Index;
