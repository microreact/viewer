import configSelector from "../selectors/config";

import Component from "../components/Theme.react";
import { connectToPresentState } from "../utils/state";
import defaults from "../defaults";

function mapStateToProps(state) {
  return {
    theme: configSelector(state).theme ?? defaults.theme,
  };
}

export default connectToPresentState(Component, mapStateToProps);
