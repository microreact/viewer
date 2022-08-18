import Component from "../components/SlicerFilterMenu.react";
import dataFieldFilterSelector from "../selectors/filters/data-field-filter";
import { connectToPresentState } from "../utils/state";

const mapStateToProps = (state, { dataField }) => {
  return {
    filter: dataFieldFilterSelector(state, dataField.name),
  };
};
export default connectToPresentState(Component, mapStateToProps);
