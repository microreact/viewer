import Component from "../components/BusyIndicator.react";

import { connectToPresentState } from "../utils/state";

function mapStateToProps(state) {
  return {
    isBuzy: state.config.isBuzy,
  };
}

export default connectToPresentState(Component, mapStateToProps);
