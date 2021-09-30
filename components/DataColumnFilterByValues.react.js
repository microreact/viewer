import PropTypes from "prop-types";
import React from "react";

import { DataFilter } from "../utils/prop-types";
import UiSelectList from "./UiSelectList.react";
import UiFloatingFilter from "./UiFloatingFilter.react";

import { emptyArray } from "../constants";

const DataColumnFilterByValues = React.memo(
  (props) => {
    const valuesFilter = (props.filter && props.filter.operator === "in") ? props.filter : undefined;

    return (
      <UiFloatingFilter
        items={props.uniqueValues}
        label="Search"
        valueGetter={(x) => x.label?.toString()?.toLowerCase()}
      >
        {
          (items) => (
            <UiSelectList
              // boxed={false}
              items={items}
              onChange={
                (selection) => {
                  props.onColumnFilterChange(
                    selection.length ? "in" : null,
                    selection,
                  );
                }
              }
              value={valuesFilter ? valuesFilter.value : emptyArray}
              selectAll
              selectOnly
              style={
                {
                  height: 40 + props.uniqueValues.length * 28,
                  maxHeight: props.height ?? "max(144px, calc(60vh - 256px))",
                }
              }
            />
          )
        }
      </UiFloatingFilter>
    );
  }
);

DataColumnFilterByValues.displayName = "DataColumnFilterByValues";

DataColumnFilterByValues.propTypes = {
  filter: DataFilter,
  onColumnFilterChange: PropTypes.func.isRequired,
  uniqueValues: PropTypes.array,
  height: PropTypes.number,
};

export default DataColumnFilterByValues;
