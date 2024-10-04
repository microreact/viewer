import PropTypes from "prop-types";
import React from "react";

import UiFieldsList from "./UiFieldsList.react.js";
import UiControlsMenu from "./UiControlsMenu.react.js";

import { update } from "../actions/charts.js";

import dataColumnsSelector from "../selectors/datasets/data-columns.js";
import chartStateSelector from "../selectors/charts/chart-state.js";
import { useAppDispatch, usePresentSelector } from "../utils/hooks.js";

function ChartCategoriesControls(props) {
  const dispatch = useAppDispatch();
  const handleCategoriesFieldChange = (categoriesField) => {
    dispatch(update(props.chartId, "categoriesField", categoriesField));
  };
  const datasetColumns = usePresentSelector(dataColumnsSelector);
  const categoriesField = usePresentSelector(
    (state) => chartStateSelector(state, props.chartId).categoriesField
  );
  return (
    <UiControlsMenu
      title="Categories"
      className="mr-chart-controls-menu"
      active={!!categoriesField}
    >
      <UiFieldsList
        columns={datasetColumns}
        onChange={handleCategoriesFieldChange}
        value={categoriesField}
        style={
          {
            maxHeight: "calc(100vh - 240px)",
            flexDirection: "row",
            overflow: "auto",
          }
        }
      />
    </UiControlsMenu>
  );
}

ChartCategoriesControls.propTypes = {
  chartId: PropTypes.string.isRequired,
};

export default ChartCategoriesControls;
