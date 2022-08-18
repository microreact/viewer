import { initialState } from "../../reducers/charts";

const chartStateSelector = (state, chartId) => state.charts[chartId] || initialState;

export default chartStateSelector;
