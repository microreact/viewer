import PropTypes from "prop-types";
import React from "react";
import Button from "@material-ui/core/Button";

import UiSelect from "./UiSelect.react";
import UiCombobox from "./UiCombobox.react";
import { DataColumn } from "../utils/prop-types";

function TimelinePaneEditor(props) {
  const timelineState = props.timelineState;
  return (
    <React.Fragment>
      <UiSelect
        label="Temporal Data Type"
        variant="outlined"
        size="small"
        value={timelineState.dataType}
        onChange={(value) => props.onTimelinePropChange("dataType", value)}
        options={
          [
            {
              label: "Three columns: Year, Month, and Day",
              secondary: "Metadata includes three columns for year, month, and day.",
              value: "year-month-day",
            },
            {
              label: "One column: Formatted Values",
              secondary: "Metadata include one column of temporal data",
              value: "formatted-value",
            },
          ]
        }
      />

      {
        (timelineState.dataType === "year-month-day") && (
          <React.Fragment>
            <UiCombobox
              label="Year Column"
              options={props.dataFields.filter((x) => x.dataType === "number")}
              onChange={(value) => props.onTimelinePropChange("yearField", value.name)}
              value={timelineState.yearField}
            />

            <UiCombobox
              label="Month Column"
              options={props.dataFields.filter((x) => x.dataType === "number")}
              onChange={(value) => props.onTimelinePropChange("monthField", value.name)}
              value={timelineState.monthField}
            />

            <UiCombobox
              label="Day Column"
              options={props.dataFields.filter((x) => x.dataType === "number")}
              onChange={(value) => props.onTimelinePropChange("dayField", value.name)}
              value={timelineState.dayField}
            />
          </React.Fragment>
        )
      }

      {
        (timelineState.dataType === "formatted-value") && (
          <React.Fragment>
            <UiCombobox
              label="Temporal Data Column"
              options={props.dataFields.filter((x) => x.dataType === "date")}
              onChange={(value) => props.onTimelinePropChange("valueField", value.name)}
              value={timelineState.valueField}
            />
          </React.Fragment>
        )
      }
    </React.Fragment>
  );
}

TimelinePaneEditor.displayName = "TimelinePaneEditor";

TimelinePaneEditor.propTypes = {
  dataFields: PropTypes.arrayOf(DataColumn).isRequired,
  timelineId: PropTypes.string.isRequired,
  timelineState: PropTypes.object.isRequired,
  onTimelinePropChange: PropTypes.func.isRequired,
};

export default TimelinePaneEditor;
