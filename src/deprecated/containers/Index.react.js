import fullDatasetSelector from "../selectors/datasets/full-dataset";

import Component from "../components/DataPlaceholder.react";

import { connectToPresentState } from "../utils/state";

function mapStateToProps(state) {
  return {
    datasets: state.datasets,
    files: state.files,
    isEmpty: !fullDatasetSelector(state),
    isLoading: state.config.loading,
  };
}

export default connectToPresentState(Component, mapStateToProps);
