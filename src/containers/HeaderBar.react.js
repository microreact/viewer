import { setSidePane } from "../actions/panes";
import { save } from "../actions/ui";

import HeaderBar from "../components/HeaderBar.react";
import configSelector from "../selectors/config";
import { connectToPresentState } from "../utils/state";

const mapStateToProps = (state) => {
  return {
    isReadOnly: configSelector(state).readOnly,
    title: state.meta.name,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSave: () => dispatch(save()),
  onSidePaneChange: (pane) => dispatch(setSidePane(pane)),
  onToggleHistoryPane: () => dispatch(setSidePane("History")),
  onToggleStylesPane: () => dispatch(setSidePane("Styles")),
  onToggleViewsPane: () => dispatch(setSidePane("Views")),
});

export default connectToPresentState(HeaderBar, mapStateToProps, mapDispatchToProps);
