import TextEditorComponent from "../components/TextEditor.react";
import { connectToPresentState } from "../utils/state";
import { update } from "../actions/meta";

function mapStateToProps(state, _props) {
  return state.meta;
}

function mapDispatchToProps(dispatch, props) {
  console.log("props", props);
  return {
    onUpdateText: (value) => dispatch(update(undefined, "name", value)),
  };
}

export default connectToPresentState(TextEditorComponent, mapStateToProps, mapDispatchToProps);
