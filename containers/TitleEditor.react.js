import TitleEditorComponent from "../components/TitleEditor.react";
import { connectToPresentState } from "../utils/state";
import { update } from "../actions/meta";

function mapStateToProps(state, _props) {
  return {
    meta: state.meta,
  };
}

function mapDispatchToProps(dispatch, props) {
  console.log("mapDispatchToProps", props);
  return {
    onSaveText: (value) => dispatch(update(undefined, "meta", value)),
  };
}

export default connectToPresentState(TitleEditorComponent, mapStateToProps, mapDispatchToProps);
