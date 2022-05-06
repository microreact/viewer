import Component from "../components/UiCombobox.react";

import { connectToPresentState } from "../utils/state";

import uniqueValuesSelector from "../selectors/datasets/unique-values";

function mapStateToProps(state, { columnName }) {
  return {
    options: uniqueValuesSelector(state, columnName),
  };
}

export default connectToPresentState(Component, mapStateToProps);
