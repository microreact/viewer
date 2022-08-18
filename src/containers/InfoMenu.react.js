import Component from "../components/InfoMenu.react";
import { connectToPresentStateWithRef } from "../utils/state";

function mapStateToProps(state) {
  return state.meta;
}

export default connectToPresentStateWithRef(Component, mapStateToProps);
