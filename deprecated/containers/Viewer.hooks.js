import React from "react";
import { ActionCreators } from "redux-undo";
import { useDispatch, useSelector } from "react-redux";

import fullDatasetSelector from "../selectors/datasets/full-dataset";

import Component from "../components/Viewer.react";

function connectedComponent(props) {
  const dispatch = useDispatch();
  const datasets = useSelector((state) => state.present.datasets);
  const files = useSelector((state) => state.present.files);
  const isEmpty = useSelector((state) => !fullDatasetSelector(state.present));
  return (
    <Component
      {...props}
      datasets={datasets}
      files={files}
      isEmpty={isEmpty}
      onUndo={() => dispatch(ActionCreators.undo())}
      onRedo={() => dispatch(ActionCreators.redo())}
    />
  );
}

export default connectedComponent;
