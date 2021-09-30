import { connect } from "react-redux";
import { ActionCreators } from "redux-undo";
import { setSidePane } from "../actions/panes";

import HistoryPane from "../components/HistoryPane.react";

const mapStateToProps = (rootState) => {
  return {
    rootState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: () => dispatch(setSidePane()),
    onJump: (index) => dispatch(ActionCreators.jump(index)),
    onRedo: () => dispatch(ActionCreators.redo()),
    onUndo: () => dispatch(ActionCreators.undo()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoryPane);
