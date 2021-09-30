import {
  setColourByField,
  setLabelByField,
  setShapeByField,
  setDefaultColour,
} from "../actions/styles";

import coloursDataColumnSelector from "../selectors/styles/colours-data-column";
import dataColumnsSelector from "../selectors/datasets/data-columns";
import labelsDataColumnSelector from "../selectors/styles/labels-data-column";
import shapableDataFieldsSelector from "../selectors/styles/shapable-data-fields";
import shapesDataColumnSelector from "../selectors/styles/shapes-data-column";

import Component from "../components/StylesMenuContent.react";
import { connectToPresentState } from "../utils/state";

const mapStateToProps = (state) => {
  const colourByDataField = coloursDataColumnSelector(state);

  return {
    colourableFields: dataColumnsSelector(state),
    colourByDataField,
    defaultColour: state.styles.defaultColour,
    labelByDataField: labelsDataColumnSelector(state),
    labelFields: dataColumnsSelector(state),
    shapableDataFields: shapableDataFieldsSelector(state),
    shapeByDataField: shapesDataColumnSelector(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  onColourByFieldChange: (field) => dispatch(setColourByField(field)),
  onDefaultColourChange: (field) => dispatch(setDefaultColour(field)),
  onLabelByFieldChange: (field) => dispatch(setLabelByField(field)),
  onShapeByFieldChange: (field) => dispatch(setShapeByField(field)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
