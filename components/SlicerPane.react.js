import PropTypes from "prop-types";
import React from "react";
import { createSelector } from "reselect";
import { scaleLog } from "d3-scale";

import "../css/slicer-pane.css";

import SlicerControls from "./SlicerControls.react";
import { DataColumn, DataFilter } from "../utils/prop-types";
import { emptyArray, emptyObject } from "../constants";
import UiSelectList from "./UiSelectList.react";

const groupBy = (item) => (item.group ?? "");

const sortFunctions = {
  // alphabetical: (a, b) => a.value.localeCompare(a.value),
  descending: (a, b) => (b.count - a.count),
  ascending: (a, b) => (a.count - b.count),
};

class SlicerPane extends React.PureComponent {

  groupsDataSelector = createSelector(
    (params) => params.allRows,
    (params) => params.dataColumn,
    (params) => params.groupColumn,
    (
      allRows,
      dataColumn,
      groupColumn,
    ) => {
      if (dataColumn && groupColumn) {
        const groups = {};
        for (const row of allRows) {
          groups[row[dataColumn.name]] = row[groupColumn.name];
        }
        return groups;
      }
      else {
        return emptyObject;
      }
    }
  );

  // valuesSelector = createSelector(
  //   (props) => props.allRows,
  //   (props) => props.dataColumn,
  //   (props) => props.groupColumn,
  //   (
  //     allRows,
  //     dataColumn,
  //     groupColumn,
  //   ) => {
  //     if (dataColumn) {
  //       const items = [];
  //       const groups = {};
  //       const counts = {};
  //       if (groupColumn) {
  //         for (const row of allRows) {
  //           counts[row[dataColumn.name]] = (counts[row[dataColumn.name]] ?? 0) + 1;
  //           groups[row[dataColumn.name]] = row[groupColumn.name];
  //         }
  //       }
  //       else {
  //         for (const row of allRows) {
  //           counts[row[dataColumn.name]] = (counts[row[dataColumn.name]] ?? 0) + 1;
  //         }
  //       }
  //       for (const value of Object.keys(counts)) {
  //         items.push({
  //           value,
  //           count: counts[value],
  //           group: groups[value],
  //         });
  //       }
  //       return items;
  //     }
  //     else {
  //       return emptyArray;
  //     }
  //   }
  // );

  orderedValuesSelector = createSelector(
    (props) => props.uniqueValues,
    (props) => props.sortOrder ?? "alphabetical",
    (
      values,
      sortOrder,
    ) => {
      if (sortOrder !== "alphabetical") {
        return [ ...values ].sort(sortFunctions[sortOrder]);
      }
      else {
        return values;
      }
    },
  );

  itemsSelector = createSelector(
    (props) => this.orderedValuesSelector(props),
    (props) => this.groupsDataSelector(props),
    (props) => props.displayMode,
    (props) => props.coloursMap,
    (
      values,
      groups,
      displayMode,
      coloursMap,
    ) => {
      let maxCount = 0;
      let minCount = Number.MAX_SAFE_INTEGER;
      for (const { count } of values) {
        if (count < minCount) {
          minCount = count;
        }
        if (count > maxCount) {
          maxCount = count;
        }
      }

      const scale = (
        scaleLog()
          .domain([ minCount, maxCount ])
          .range([ 100 * minCount / maxCount, 100 ])
      );

      const items = [];
      for (const { value, label, count } of values) {
        const style = { width: `${scale(count)}%` };
        if (displayMode === "coloured-by-data") {
          style.backgroundColor = coloursMap.get(value);
        }
        else if (displayMode === "coloured-by-group") {
          style.backgroundColor = coloursMap.get(groups[value]);
        }

        items.push({
          style,
          count,
          group: groups[value],
          label,
          // title: `${label} (${count})`,
          value,
        });
      }

      return items;
    }
  );

  renderItemContent = (item) => {
    return (
      <div
        className="mr-slicer-content"
        title={item.count}
      >
        <div
          className="mr-slicer-bar"
          style={item.style}
        />
      </div>
    );
  }

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
        renderItemContent={props.displayMode !== "off" ? this.renderItemContent : undefined}
        showSelectOnly
        style={
          {
            height: 40 + props.uniqueValues.length * 28,
            maxHeight: props.height ?? "max(144px, calc(60vh - 256px))",
          }
        }
        value={selectedValues}
        valueProperty="value"
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
  coloursMap: PropTypes.instanceOf(Map),
  columnFilter: DataFilter,
  dataColumn: DataColumn.isRequired,
  displayMode: PropTypes.string,
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
