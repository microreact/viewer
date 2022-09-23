import PropTypes from "prop-types";
import React from "react";
import { createSelector } from "reselect";
import { scaleLog } from "d3-scale";

// import "../styles/slicer-pane.css";

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

  valuesSelector = createSelector(
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
    (props) => this.valuesSelector(props),
    (props) => this.groupsDataSelector(props),
    (props) => props.displayMode,
    (
      values,
      groups,
    ) => {
      const items = [];

      for (const { value, label, count } of values) {
        items.push({
          count,
          group: groups[value],
          label,
          value,
        });
      }

      return items;
    }
  );

  scaleSelector = createSelector(
    (props) => props.uniqueValues,
    (props) => props.displayMode,
    (
      values,
      displayMode,
    ) => {
      if (displayMode === "off") {
        return undefined;
      }

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

      return (
        scaleLog()
          .domain([ minCount, maxCount ])
          .range([ 100 * minCount / maxCount, 100 ])
      );
    }
  );

  renderItemContent = (item) => {
    const { props } = this;

    if (props.displayMode === "off") {
      return null;
    }

    const scale = this.scaleSelector(props);
    const style = { width: `${scale(item.count)}%` };

    if (props.coloursMap) {
      if (props.displayMode === "coloured-by-data") {
        style.backgroundColor = props.coloursMap.get(item.value);
      }
      else if (props.displayMode === "coloured-by-group") {
        style.backgroundColor = props.coloursMap.get(item.group);
      }
    }

    return (
      <div
        className="mr-slicer-content"
        title={item.count}
      >
        <div
          className="mr-slicer-bar"
          style={style}
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
        renderItemContent={(props.displayMode !== "off") ? this.renderItemContent : undefined}
        showSelectOnly
        style={emptyObject}
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
