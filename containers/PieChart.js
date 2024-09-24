import PieChart from "../components/PieChart.js";
import { connectToPresentState } from "../utils/state.js";
import activeRowsWithStyleFieldsSelector from "../selectors/filters/active-rows-with-style-fields.js";

import activeRowsIdsSelector from "../selectors/filters/active-row-ids.js";
import colourMapForFieldSelector from "../selectors/styles/colour-map-for-field.js";

function mapStateToProps(state, { chartId }) {
  const chartState = state.charts[chartId];
  const categoriesField = chartState.categoriesField;
  return {
    activeIdsSet: activeRowsIdsSelector(state),
    activeRows: activeRowsWithStyleFieldsSelector(state).rows,
    categoriesField,
    colourMap: colourMapForFieldSelector(state, categoriesField),
    excludeNullValues: chartState.excludeNullValues,
    minSliceCount: chartState.minSliceCount,
    sliceLabels: chartState.sliceLabels,
    sliceScaleType: chartState.sliceScaleType,
  };
}

function mapDispatchToProps(dispatch, { chartId }) {
  return {
  };
}

export default connectToPresentState(PieChart, mapStateToProps, mapDispatchToProps);
