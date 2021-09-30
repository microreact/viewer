import PropTypes from "prop-types";
import React from "react";

import UiSelect from "./UiSelect.react";

const options = [
  {
    label: "Auto",
    secondary: "Based on the detected data type of the column",
    value: "auto",
  },
  {
    label: "Discrete",
    secondary: "Rendered as bar chart",
    value: "nominal",
  },
  {
    label: "Continuous",
    secondary: "Rendered as binned bar chart",
    value: "quantitative",
  },
];

const ChartDataTypeSelect = React.memo(
  (props) => {
    return (
      <UiSelect
        label="Chart Data Type"
        onChange={(value) => props.onChange(value)}
        options={options}
        size="small"
        value={props.value}
        variant="outlined"
      />
    );
  }
);

ChartDataTypeSelect.displayName = "ChartDataTypeSelect";

ChartDataTypeSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOf([ "auto", "nominal", "quantitative" ]),
};

export default ChartDataTypeSelect;
