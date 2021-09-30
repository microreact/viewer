import Component from "../components/BusyIndicator.react";

import { connectToPresentState } from "../utils/state";

function mapStateToProps(state) {
  return {
    isLoading: state.config.loading,
  };
}

export default connectToPresentState(Component, mapStateToProps);
