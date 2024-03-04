import {
  expandColumn,
  hideColumn,
  sortColumn,
} from "../actions/tables";
import { setFieldFilter } from "../actions/filters";
import dataFieldFilterSelector from "../selectors/filters/data-field-filter";
import { connectToPresentState } from "../utils/state";

import Component from "../components/TableHeaderMenuContent.react";

const mapStateToProps = (state, { dataColumn }) => {
  return {
    filter: dataFieldFilterSelector(state, dataColumn.name),
  };
};

const mapDispatchToProps = (dispatch, { tableId }) => ({
  onColumnExpand: (field) => dispatch(expandColumn(tableId, field)),
  onColumnFilterChange: (field, operator, value) => dispatch(setFieldFilter(field, operator, value)),
  onColumnHide: (field) => dispatch(hideColumn(tableId, field)),
  onColumnSort: (field, direction) => dispatch(sortColumn(tableId, field, direction)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
