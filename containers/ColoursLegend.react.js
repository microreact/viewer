import { selectQueryRows } from "../actions/filters";

import Component from "../components/ColoursLegend.react";

import coloursLegendEntriesSelector from "../selectors/styles/colours-legend-entries";

import { connectToPresentState } from "../utils/state";

function mapStateToProps(state, { field }) {
  const { scale, entries } = coloursLegendEntriesSelector(state, field);
  return {
    entries,
    scale,
  };
}

function mapDispatchToProps(dispatch, { field }) {
  return {
    onSelectQueryRows: (value, merge) => dispatch(selectQueryRows({ [field]: value }, merge)),
  };
}

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
