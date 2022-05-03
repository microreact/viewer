import PropTypes from "prop-types";
import React from "react";
import { createSelector } from "reselect";

import "../css/slicer-pane.css";

import SlicerControls from "./SlicerControls.react";
import { DataColumn, DataFilter } from "../utils/prop-types";
import { emptyArray } from "../constants";
import UiSelectList from "./UiSelectList.react";

const groupBy = (item) => (item.group ?? "");

const sortFunctions = {
  alphabetical: (a, b) => a.value.localeCompare(a.value),
  ascending: (a, b) => (b.count - a.count),
  descending: (a, b) => (a.count - b.count),
};

class SlicerPane extends React.PureComponent {

  valuesSelector = createSelector(
    (props) => props.allRows,
    (props) => props.dataColumn,
    (props) => props.groupColumn,
    (
      allRows,
      dataColumn,
      groupColumn,
    ) => {
      if (dataColumn) {
        const items = [];
        const groups = {};
        const counts = {};
        if (groupColumn) {
          for (const row of allRows) {
            counts[row[dataColumn.name]] = (counts[row[dataColumn.name]] ?? 0) + 1;
            groups[row[dataColumn.name]] = row[groupColumn.name];
          }
        }
        else {
          for (const row of allRows) {
            counts[row[dataColumn.name]] = (counts[row[dataColumn.name]] ?? 0) + 1;
          }
        }
        for (const value of Object.keys(counts)) {
          items.push({
            value,
            count: counts[value],
            group: groups[value],
          });
        }
        return items;
      }
      else {
        return emptyArray;
      }
    }
  );

  orderedValuesSelector = createSelector(
    (props) => this.valuesSelector(props),
    (props) => props.sortOrder ?? "alphabetical",
    (
      values,
      sortOrder,
    ) => {
      return values.sort(sortFunctions[sortOrder]);
    },
  );

  itemsSelector = createSelector(
    (props) => this.orderedValuesSelector(props),
    (props) => props.uniqueValues,
    (props) => props.colourMode,
    (props) => props.dataColumn,
    (props) => props.groupColumn,
    (
      values,
      uniqueValues,
      colourMode,
      dataColumn,
      groupColumn,
    ) => {
      const items = [];
      for (const row of values) {
        groups[row[dataColumn.name]] = row[groupColumn.name];
      }
      for (const { name, label } of uniqueValues) {
        items.push({
          name,
          label,
          group: groups[name],
        });
      }
      return items;
    }
  );

  renderSlicer() {
    const { props } = this;

    const valuesFilter = (props.columnFilter && props.columnFilter.operator === "in") ? props.columnFilter : undefined;
    const selectedValues = valuesFilter ? valuesFilter.value : emptyArray;
    return (
      <UiSelectList
        disableSelectAll
        groupItem={props.groupColumn ? groupBy : undefined}
        items={this.itemsSelector(props)}
        onChange={
          (selection) => {
            props.onColumnFilterChange(
              props.dataColumn.name,
              (selection.length > 0) ? "in" : null,
              selection,
            );
          }
        }
        showSelectOnly
        style={
          {
            height: 40 + props.uniqueValues.length * 28,
            maxHeight: props.height ?? "max(144px, calc(60vh - 256px))",
          }
        }
        value={selectedValues}
      />
    );
  }

  render() {
    const { props } = this;

    return (
      <div className="mr-slicer">
        { this.renderSlicer() }
        {
          (!props.isReadOnly) && (
            <SlicerControls
              isReadOnly={props.isReadOnly}
              onEditPane={props.onEditPane}
              slicerId={props.slicerId}
              slicerType={props.slicerType}
            />
          )
        }
      </div>
    );
  }
}

SlicerPane.propTypes = {
  columnFilter: DataFilter.isRequired,
  dataColumn: DataColumn.isRequired,
  groupColumn: DataColumn,
  height: PropTypes.number.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  onColumnFilterChange: PropTypes.func.isRequired,
  onEditPane: PropTypes.func.isRequired,
  slicerId: PropTypes.string.isRequired,
  slicerType: PropTypes.string.isRequired,
  uniqueValues: PropTypes.array,
};

SlicerPane.defaultProps = {
};

export default SlicerPane;
