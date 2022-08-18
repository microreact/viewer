import { mapQueryToProps } from "../utils/query";
import { newId, removeKeyedState } from "../utils/state";

export const initialState = {
  controls: true,
  interpolate: "linear",
  seriesStacking: "stacked",
  xAxisLabelLimit: 120,
  yAxisLabelLimit: 30,
};

const queryPropMap = {
  controls: { key: "cc", type: Boolean },
};

function updateChart(state, chartId, updater) {
  return {
    ...state,
    [chartId]: {
      ...state[chartId],
      ...updater,
    },
  };
}

export default function (state = {}, action) {
  switch (action.type) {

    case "MICROREACT VIEWER/ADD CHART": {
      const chartId = action.payload.chartId || newId(state, "chart");
      return {
        ...state,
        [chartId]: {
          ...initialState,
          title: action.payload.title,
          ...action.payload,
        },
      };
    }

    case "MICROREACT VIEWER/LOAD": {
      const charts = {};
      for (const chartId of Object.keys(action.payload.charts)) {
        charts[chartId] = {
          ...initialState,
          ...action.payload.charts[chartId],
          ...mapQueryToProps(queryPropMap, action.payload.query),
        };
      }
      return charts;
    }

    case "MICROREACT VIEWER/REMOVE CHART": {
      return removeKeyedState(
        state,
        action.payload.paneId,
      );
    }

    case "MICROREACT VIEWER/UPDATE CHART": {
      return updateChart(
        state,
        action.chartId,
        action.payload,
      );
    }

    default:
      return state;
  }
}
