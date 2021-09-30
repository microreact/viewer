import Component from "../components/InfoMenu.react";
import { connectToPresentStateWithRef } from "../utils/state";

const mapStateToProps = (state) => {
  return state.meta;
};

const mapDispatchToProps = (dispatch) => ({
});

export default connectToPresentStateWithRef(Component, mapStateToProps, mapDispatchToProps);
