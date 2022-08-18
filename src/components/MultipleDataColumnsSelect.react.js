import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import UiFloatingFilter from "./UiFloatingFilter.react";
import UiSelectList from "./UiSelectList.react";

import "../css/multiple-data-columns-select.css";
import { DataColumn } from "../utils/prop-types";

const groupBy = (item) => (item.group ?? "");

const MultipleDataColumnsSelect = React.memo(
  (props) => {
    return (
      <UiFloatingFilter
        className={
          classnames(
            "mr-multiple-data-columns-select",
            props.className,
          )
        }
        items={props.dataColumns}
        label="Search columns"
        style={props.style}
        renderItems={
          (items) => (
            <UiSelectList
              items={items}
              onChange={props.onChange}
              value={props.value}
              groupItem={groupBy}
              showSelectOnly
              style={
                {
                  height: 40 + props.dataColumns.length * 28,
                  maxHeight: `calc(100vh - ${props.maxHeightOffset})`,
                }
              }
            />
          )
        }
      />
    );
  },
);

MultipleDataColumnsSelect.displayName = "MultipleDataColumnsSelect";

MultipleDataColumnsSelect.propTypes = {
  className: PropTypes.string,
  dataColumns: PropTypes.arrayOf(DataColumn),
  maxHeightOffset: PropTypes.string,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  style: PropTypes.object,
  value: PropTypes.array,
};

MultipleDataColumnsSelect.defaultProps = {
};

export default MultipleDataColumnsSelect;
