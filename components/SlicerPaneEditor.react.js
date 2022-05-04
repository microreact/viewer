import PropTypes from "prop-types";
import React from "react";
import { createSelector } from "reselect";

import { DataColumn } from "../utils/prop-types";
import { toText } from "../utils/text";

import UiSelect from "./UiSelect.react";
import UiCombobox from "./UiCombobox.react";
import UiTextfield from "./UiTextfield.react";

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
          uniqueValues.add(value?.toString());
        }
      }

      const items = [];

      for (const value of Array.from(uniqueValues).sort()) {
        items.push({
          name: value,
          label: toText(
            dataColumn.dataType,
            value,
          ),
        });
      }

      return items;

    },
  )

  render() {
    const { props } = this;

    return (
      <React.Fragment>

        <UiCombobox
          label="Data Column"
          onChange={(value) => props.onSlicerPropChange("field", value.name)}
          options={props.dataColumns}
          value={props.dataColumn?.name}
        />

        <UiCombobox
          clearable
          label="Group Column"
          onChange={(value) => props.onSlicerPropChange("groupField", value?.name || null)}
          options={props.dataColumns}
          value={props.groupColumn?.name}
        />

        <UiSelect
          label="Display mode"
          onChange={(value) => props.onSlicerPropChange("displayMode", value)}
          options={
            [
              {
                label: "Do not show bars",
                value: "off",
              },
              {
                label: "Show bars without colours",
                value: "uncoloured",
              },
              {
                label: "Colour bars by data column",
                value: "coloured-by-data",
              },
              {
                label: "Colour bars by group column",
                value: "coloured-by-group",
              },
            ]
          }
          size="small"
          value={props.displayMode}
          variant="outlined"
        />

        <UiSelect
          label="Sort by"
          onChange={(value) => props.onSlicerPropChange("sortOrder", value)}
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
          size="small"
          value={props.sortOrder}
          variant="outlined"
        />

        {/* <UiSelect
          label="Colours"
          onChange={(value) => props.onSlicerPropChange("colourMode", value)}
          options={
            [
              {
                label: "Do not colour slicer items",
                value: "off",
              },
              {
                label: "Colour items by data column",
                value: "data",
              },
              {
                label: "Colour items by group column",
                value: "group",
              },
            ]
          }
          size="small"
          value={props.colourMode ?? "off"}
          variant="outlined"
        /> */}

      </React.Fragment>
    );
  }

}

SlicerPaneEditor.displayName = "SlicerPaneEditor";

SlicerPaneEditor.propTypes = {
  dataColumn: DataColumn,
  dataColumns: PropTypes.arrayOf(DataColumn).isRequired,
  dataRows: PropTypes.array.isRequired,
  displayMode: PropTypes.string,
  groupColumn: DataColumn,
  onSlicerPropChange: PropTypes.func.isRequired,
  slicerId: PropTypes.string.isRequired,
  sortOrder: PropTypes.string,
};

export default SlicerPaneEditor;
