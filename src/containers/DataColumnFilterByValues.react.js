import filterableValuesSelector from "../selectors/tables/filterable-values";
import { setFieldFilter } from "../actions/filters";
import dataFieldFilterSelector from "../selectors/filters/data-field-filter";
import { connectToPresentState } from "../utils/state";

import Component from "../components/DataColumnFilterByValues.react";

const mapStateToProps = (state, { field }) => {
  return {
    uniqueValues: filterableValuesSelector(state, field),
    filter: dataFieldFilterSelector(state, field),
  };
};

const mapDispatchToProps = (dispatch, { field }) => ({
  onColumnFilterChange: (operator, value) => dispatch(setFieldFilter(field, operator, value)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
