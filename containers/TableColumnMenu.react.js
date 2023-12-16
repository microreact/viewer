import dataFieldFilterSelector from "../selectors/filters/data-field-filter";

import { connectToPresentState } from "../utils/state";

import Component from "../components/TableHeaderMenu.react";

function mapStateToProps(state, { dataColumn }) {
  return {
    filter: dataFieldFilterSelector(state, dataColumn.name),
  };
}

export default connectToPresentState(Component, mapStateToProps, null);
