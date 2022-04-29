import {
  expandColumn,
  hideColumn,
  sortColumn,
} from "../actions/tables";
import { setFieldFilter } from "../actions/filters";
import dataFieldFilterSelector from "../selectors/filters/data-field-filter";
import { connectToPresentState } from "../utils/state";

import Component from "../components/TableHeaderMenuContent.react";

const mapStateToProps = (state, { tableColumn }) => {
  return {
    filter: dataFieldFilterSelector(state, tableColumn.field),
  };
};

const mapDispatchToProps = (dispatch, { tableColumn }) => ({
  onColumnExpand: (field) => dispatch(expandColumn(tableColumn.tableId, field)),
  onColumnFilterChange: (field, operator, value) => dispatch(setFieldFilter(field, operator, value)),
  onColumnHide: (field) => dispatch(hideColumn(tableColumn.tableId, field)),
  onColumnSort: (field, direction) => dispatch(sortColumn(tableColumn.tableId, field, direction)),
});

export default connectToPresentState(Component, mapStateToProps, mapDispatchToProps);
