import { ActionCreators } from "redux-undo";

import fullDatasetSelector from "../selectors/datasets/full-dataset";

import Component from "../components/Viewer.react";
import configSelector from "../selectors/config";
import { connectToPresentState } from "../utils/state";

function mapStateToProps(state) {
  return {
    theme: configSelector(state).theme,
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

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
