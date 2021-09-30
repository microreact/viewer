import PropTypes from "prop-types";
import React from "react";
import Box from "@material-ui/core/Box";
import { createSelector } from "reselect";

import { DataColumn } from "../utils/prop-types";
import { halfWidthWithPaddingStyle, fullSizeStyle } from "../constants";
import { toText } from "../utils/text";

import UiSelect from "./UiSelect.react";
import UiCombobox from "./UiCombobox.react";
import UiTextfield from "./UiTextfield.react";
import ChartDataTypeSelect from "./ChartDataTypeSelect.react";

class SlicerPaneEditor extends React.PureComponent {

  uniqueDataValues = createSelector(
    (props) => props.dataRows,
    (props) => props.dataColumn,
    (
      rows,
      dataColumn,
    ) => {
      const uniqueValues = new Set();

      if (dataColumn) {
        for (const row of rows) {
          const value = row[dataColumn.name];
          uniqueValues.add(value.toString());
        }
      }

      const items = [];

      for (const value of Array.from(uniqueValues).sort()) {
        items.push({
          name: value,
          label: toText(
            dataColumn.dataType,
            value,
            true /* convertBlanks */,
          ),
        });
      }

      return items;

    },
  )

  render() {
    const { props } = this;

    const slicerState = props.slicerState;
    return (
      <React.Fragment>

        <UiCombobox
          label="Data Column"
          onChange={(value) => props.onSlicerPropChange("field", value.name)}
          options={props.dataColumns}
          value={slicerState.field}
        />

        <Box display="flex" justifyContent="space-between">
          <Box style={(slicerState.includedValues === "top") ? halfWidthWithPaddingStyle : fullSizeStyle}>
            <UiSelect
              label="Included Values"
              variant="outlined"
              size="small"
              value={slicerState.includedValues}
              onChange={(value) => props.onSlicerPropChange("includedValues", value)}
              options={
                [
                  {
                    label: "Include all values",
                    value: "all",
                  },
                  {
                    label: "Top N values",
                    value: "top",
                  },
                  {
                    label: "Choose which values to include",
                    value: "custom",
                  },
                ]
              }
              style={fullSizeStyle}
            />
          </Box>
          {
            (slicerState.includedValues === "top") && (
              <Box style={halfWidthWithPaddingStyle}>
                <UiTextfield
                  autoFocus
                  fullWidth
                  label="Maximum number of values"
                  onChange={(value) => props.onSlicerPropChange("topNValues", parseInt(value, 10))}
                  style={fullSizeStyle}
                  type="number"
                  value={slicerState.topNValues.toString()}
                  variant="outlined"
                />
              </Box>
            )
          }
        </Box>

        {
          (slicerState.includedValues === "custom") && (
            <UiCombobox
              autoFocus
              label="Values to include"
              multiple
              onChange={(values) => props.onSlicerPropChange("dataValues", values.map((x) => x.name))}
              options={this.uniqueDataValues(props)}
              value={(slicerState.dataValues?.length > 0) ? this.uniqueDataValues(props).filter((x) => slicerState.dataValues.includes(x.name)) : []}
            />
          )
        }

        <UiSelect
          label="Slicer Type"
          variant="outlined"
          size="small"
          value={slicerState.slicerType}
          onChange={(value) => props.onSlicerPropChange("slicerType", value)}
          options={
            [
              {
                label: "Filter Chart",
                // secondary: "Metadata include a column for ISO 3166-1 or 3166-2 codes",
                value: "chart",
              },
              {
                label: "Filter by values",
                // secondary: "Metadata include a column for ISO 3166-1 or 3166-2 codes",
                value: "values",
              },
              // {
              //   label: "Filter by condition",
              //   // secondary: "Metadata include a column for ISO 3166-1 or 3166-2 codes",
              //   value: "condition",
              // },
            ]
          }
        />

        {
          (slicerState.slicerType === "chart") && (
            <ChartDataTypeSelect
              value={slicerState.chartAxisType}
              onChange={(value) => props.onSlicerPropChange("chartAxisType", value)}
            />
          )
        }

        {
          (slicerState.slicerType === "chart") && (
            <UiSelect
              label="Chart Type"
              variant="outlined"
              size="small"
              value={slicerState.chartMainAxis}
              onChange={(value) => props.onSlicerPropChange("chartMainAxis", value)}
              options={
                [
                  {
                    label: "Vertical bar chart",
                    secondary: "Data values are plotted on the x-axis",
                    value: "x",
                  },
                  {
                    label: "Horizontal bar chart",
                    secondary: "Data values are plotted on the y-axis",
                    value: "y",
                  },
                ]
              }
            />
          )
        }

        {
          (slicerState.slicerType === "chart") && (
            <UiSelect
              label="Sort by"
              variant="outlined"
              size="small"
              value={slicerState.chartOrder}
              onChange={(value) => props.onSlicerPropChange("chartOrder", value)}
              options={
                [
                  {
                    label: "Values (alphabetical order)",
                    value: "alphabetical",
                  },
                  {
                    label: "Frequency (descending order)",
                    value: "descending",
                  },
                  {
                    label: "Frequency (ascending order)",
                    value: "ascending",
                  },
                ]
              }
            />
          )
        }

        {
          (slicerState.slicerType === "chart" && props.chartAxisType === "quantitative") && (
            <UiTextfield
              fullWidth
              helperText="There will often be fewer bins since the domain get sliced at “nicely-rounded” values."
              label="Maximum number of bins"
              onChange={(value) => props.onSlicerPropChange("chartMaxBins", value)}
              type="number"
              value={slicerState.chartMaxBins}
              variant="outlined"
            />
          )
        }

      </React.Fragment>
    );
  }

}

SlicerPaneEditor.displayName = "SlicerPaneEditor";

SlicerPaneEditor.propTypes = {
  chartAxisType: PropTypes.string,
  dataColumns: PropTypes.arrayOf(DataColumn).isRequired,
  dataRows: PropTypes.array.isRequired,
  onSlicerPropChange: PropTypes.func.isRequired,
  slicerId: PropTypes.string.isRequired,
  slicerState: PropTypes.object.isRequired,
};

export default SlicerPaneEditor;
