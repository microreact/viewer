import { update, processFile, addFiles } from "../actions/ui";
import { connectToPresentState } from "../utils/state";

import ProcessFiles from "../components/ProcessFiles.react";

const mapStateToProps = (state) => {
  return {
    isLoading: state.ui.isLoading,
  };
};

const mapDispatchToProps = (dispatch) => ({
});

export default connectToPresentState(ProcessFiles, mapStateToProps, mapDispatchToProps);
