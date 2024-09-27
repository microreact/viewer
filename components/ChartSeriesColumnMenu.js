import PropTypes from "prop-types";
import React from "react";

import UiControlsMenu from "./UiControlsMenu.react.js";
import MultipleDataColumnsSelect from "./MultipleDataColumnsSelect.react.js";

import { update } from "../actions/charts.js";

import dataColumnsSelector from "../selectors/datasets/data-columns.js";
import chartStateSelector from "../selectors/charts/chart-state.js";

import { useAppDispatch, usePresentSelector } from "../utils/hooks.js";

function ChartSeriesColumnMenu(props) {
  const dispatch = useAppDispatch();
  const handleSeriesFieldsChange = (seriesFields) => {
    dispatch(update(props.chartId, "seriesFields", seriesFields));
  };
  const datasetColumns = usePresentSelector(dataColumnsSelector);
  const seriesFields = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).seriesFields
  );
  return (
    <UiControlsMenu
      title="Columns"
      className="mr-chart-controls-menu"
      active={seriesFields?.length > 0}
    >
      <MultipleDataColumnsSelect
        dataColumns={datasetColumns}
        maxHeightOffset="400px"
        onChange={handleSeriesFieldsChange}
        value={seriesFields}
      />
    </UiControlsMenu>
  );
}

ChartSeriesColumnMenu.propTypes = {
  chartId: PropTypes.string.isRequired,
};

export default ChartSeriesColumnMenu;
