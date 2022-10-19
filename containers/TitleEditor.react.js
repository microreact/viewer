import TitleEditorComponent from "../components/TitleEditor.react";
import { connectToPresentState } from "../utils/state";
import { update } from "../actions/meta";

function mapStateToProps(state) {
  return {
    meta: state.meta,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: (value) => dispatch(update("name", value)),
  };
}

export default connectToPresentState(TitleEditorComponent, mapStateToProps, mapDispatchToProps);
