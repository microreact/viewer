import GraphChart from "../components/GraphChart";
import { connectToPresentState } from "../utils/state";
import activeRowsWithStyleFieldsSelector from "../selectors/filters/active-rows-with-style-fields";

import activeRowsIdsSelector from "../selectors/filters/active-row-ids";

function mapStateToProps(state, { chartId }) {
  const chartState = state.charts[chartId];
  return {
    colourColumnName: chartState.colourColumnName,
    showLabels: chartState.showLabels,
    labelsFontSize: chartState.labelsFontSize,
    activeIdsSet: activeRowsIdsSelector(state),
    rows: activeRowsWithStyleFieldsSelector(state).rows,
  };
}

function mapDispatchToProps(dispatch, { chartId }) {
  return {
  };
}

export default connectToPresentState(GraphChart, mapStateToProps, mapDispatchToProps);
