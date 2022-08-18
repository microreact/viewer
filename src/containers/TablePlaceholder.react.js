import { connect } from "react-redux";
import { openPaneEditor } from "../actions/ui";

import PanePlaceholder from "../components/PanePlaceholder.react";
import TablePane from "./TablePane.react";

const mapStateToProps = (state, { tableId }) => {
  const tableState = state.tables[tableId];
  return {
    fileKind: "data",
    isEmpty: !tableState.columns,
    PaneComponent: TablePane,
    paneId: tableId,
  };
};

const mapDispatchToProps = (dispatch, { tableId }) => {
  return {
    onEditPane: () => dispatch(openPaneEditor(tableId)),
  };
};
export default connect((state, props) => mapStateToProps(state.present, props), mapDispatchToProps)(PanePlaceholder);
