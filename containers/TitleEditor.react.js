import TitleEditorComponent from "../components/TitleEditor.react";
import { connectToPresentState } from "../utils/state";
import { update } from "../actions/meta";

function mapStateToProps(state) {
  return {
    value: state.meta.name,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: (value) => dispatch(update("name", value)),
  };
}

export default connectToPresentState(TitleEditorComponent, mapStateToProps, mapDispatchToProps);
