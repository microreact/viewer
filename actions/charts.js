import { getPresentState } from "../utils/state";
import { filterByQuery } from "../utils/arrays";

import chartTypeSelector from "../selectors/charts/chart-type";
import dataColumnsByFieldMapSelector from "../selectors/datasets/data-columns-by-field-map";
import rowsSelector from "../selectors/datasets/rows";
import seriesFieldSelector from "../selectors/charts/series-field";
import xAxisFieldSelector from "../selectors/charts/x-axis-field";
import yAxisFieldSelector from "../selectors/charts/y-axis-field";

import { selectRows } from "./filters";

export const addChart = (paneId, title) => {
  return {
    type: "MICROREACT VIEWER/ADD CHART",
    payload: {
      paneId,
      title: title || "Chart",
    },
  };
};

export function removeChart(paneId) {
  return {
    delay: true,
    group: `${paneId}/remove`,
    label: "Chart: Remove Chart",
    payload: {
      paneId,
    },
    type: "MICROREACT VIEWER/REMOVE CHART",
  };
}

export const selectItem = (chartId, item, merge) => (
  (dispatch, getState) => {
    if (item) {
      const state = getPresentState(getState());
      const rows = rowsSelector(state);
      const fieldsMap = dataColumnsByFieldMapSelector(state);
      const chartType = chartTypeSelector(state, chartId);
      let ids = [];
      if (chartType === "custom") {
        ids = filterByQuery(rows, fieldsMap, item);
      }
      else {
        const xAxisField = xAxisFieldSelector(state, chartId);
        const yAxisField = yAxisFieldSelector(state, chartId);
        const seriesField = seriesFieldSelector(state, chartId);
        const query = {};
        if (xAxisField && (xAxisField.name in item)) {
          query[xAxisField.name] = item[xAxisField.name];
        }
        if (yAxisField && (yAxisField.name in item)) {
          query[yAxisField.name] = item[yAxisField.name];
        }
        if (seriesField && (seriesField.name in item)) {
          query[seriesField.name] = item[seriesField.name];
        }
        ids = filterByQuery(rows, fieldsMap, query);
      }
      dispatch(
        selectRows(
          ids,
          merge,
        )
      );
    }
    else {
      dispatch(
        selectRows(
          false,
          merge,
        )
      );
    }
  }
);

export const update = (chartId, key, value) => ({
  type: "MICROREACT VIEWER/UPDATE CHART",
  chartId,
  label:
    (key === "type") ? `Chart: Set chart type to ${value}` :
      (key === "seriesField") ? `Chart: Set series column to ${value}` :
        (key === "xAxisField") ? `Chart: Set X axis column to ${value}` :
          (key === "yAxisField") ? `Chart: Set Y axis column to ${value}` :
            (key === "seriesStacking") ? `Chart: Set series stacking to ${value}` :
              (key === "interpolate") ? `Chart: Set interpolate to ${value}` :
                undefined,
  delay: true,
  payload: { [key]: value },
});

export const updateMainAxisField = (chartId, key, value) => (
  (dispatch) => {
    dispatch(
      update(
        chartId,
        key,
        value,
      )
    );
    if (key === "xAxisField") {
      dispatch(
        update(
          chartId,
          "xAxisMode",
        )
      );
    }
    if (key === "yAxisField") {
      dispatch(
        update(
          chartId,
          "yAxisMode",
        )
      );
    }
  }
);
