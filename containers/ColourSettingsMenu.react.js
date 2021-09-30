import Component from "../components/ColourSettingsMenu.react";

import colourModeForFieldSelector from "../selectors/styles/colour-mode-for-field";

import { connectToPresentState } from "../utils/state";

function mapStateToProps(state, { field }) {
  return {
    colourSettings: state.styles.colourSettings[field],
    colourMode: colourModeForFieldSelector(state, field),
  };
}

export default connectToPresentState(Component, mapStateToProps, null);
