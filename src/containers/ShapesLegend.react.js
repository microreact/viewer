import { selectQueryRows } from "../actions/filters";

import Component from "../components/ShapesLegend.react";
import shapesLegendEntriesSelector from "../selectors/styles/shapes-legend-entries";

import { connectToPresentState } from "../utils/state";

function mapStateToProps(state, { field }) {
  return {
    entries: shapesLegendEntriesSelector(state, field),
  };
}

function mapDispatchToProps(dispatch, { field }) {
  return {
    onSelectQueryRows: (value, merge) => dispatch(selectQueryRows({ [field]: value }, merge)),
  };
}

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
