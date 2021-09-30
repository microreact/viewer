import { connect } from "react-redux";

import { addFiles } from "../actions/ui";

import EmptyView from "../components/EmptyView.react";
import configSelector from "../selectors/config";

const mapStateToProps = (state) => {
  const defaults = configSelector(state);
  return {
    validFileExtensions: defaults.validFileExtensions,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onFileUpload: (files) => dispatch(addFiles(files)),
});

export default connect((state, props) => mapStateToProps(state.present, props), mapDispatchToProps)(EmptyView);
