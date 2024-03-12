import GraphChart from "../components/GraphChart.js";
import { connectToPresentState } from "../utils/state.js";
import activeRowsWithStyleFieldsSelector from "../selectors/filters/active-rows-with-style-fields.js";

import activeRowsIdsSelector from "../selectors/filters/active-row-ids.js";

function mapStateToProps(state, { chartId }) {
  const chartState = state.charts[chartId];
  return {
    activeIdsSet: activeRowsIdsSelector(state),
    activeRows: activeRowsWithStyleFieldsSelector(state).rows,
    colourColumnName: chartState.colourColumnName,
    showLabels: chartState.showLabels,
  };
}

function mapDispatchToProps(dispatch, { chartId }) {
  return {
  };
}

export default connectToPresentState(GraphChart, mapStateToProps, mapDispatchToProps);
