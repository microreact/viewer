import PropTypes from "prop-types";
import React from "react";

import ChartTypeControls from "./ChartTypeControls.js";
import ChartCategoriesControls from "./ChartCategoriesControls.js";
import ChartSliceScaleControls from "./ChartSliceScaleControls.js";
import ChartSliceLabelsControls from "./ChartSliceLabelsControls.js";

function PieChartControls(props) {
  return (
    <div className="mr-main-controls mr-reverse-controls">
      <ChartTypeControls chartId={props.chartId} />
      <ChartCategoriesControls chartId={props.chartId} />
      <ChartSliceScaleControls chartId={props.chartId} />
      <ChartSliceLabelsControls chartId={props.chartId} />
    </div>
  );
}

PieChartControls.propTypes = {
  chartId: PropTypes.string.isRequired,
};

export default PieChartControls;
