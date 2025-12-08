import { ActionCreators } from "redux-undo";

import fullDatasetSelector from "../selectors/datasets/full-dataset";
import { connectToPresentState } from "../utils/state";

import Component from "../components/Viewer.react";

function mapStateToProps(state) {
  return {
    datasets: state.datasets,
    files: state.files,
    isEmpty: !fullDatasetSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onUndo: () => dispatch(ActionCreators.undo()),
    onRedo: () => dispatch(ActionCreators.redo()),
  };
}

export default connectToPresentState(
  Component,
  mapStateToProps,
  mapDispatchToProps,
);
