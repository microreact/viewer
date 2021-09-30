import dataFieldFilterSelector from "../selectors/filters/data-field-filter";

import { connectToPresentState } from "../utils/state";

import Component from "../components/TableHeaderMenu.react";

function mapStateToProps(state, { tableColumn }) {
  return {
    filter: dataFieldFilterSelector(state, tableColumn.field),
  };
}

export default connectToPresentState(Component, mapStateToProps, null);
