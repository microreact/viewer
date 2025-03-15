import PropTypes from "prop-types";
import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import { DataFilter } from "../utils/prop-types";
import { emptyArray } from "../constants";

import UiSelectList from "./UiSelectList.react";
import UiFloatingFilter from "./UiFloatingFilter.react";

const DataColumnFilterByValues = React.memo(
  (props) => {
    const valuesFilter = (props.filter && props.filter.operator === "in") ? props.filter : undefined;
    const selectedValues = valuesFilter ? valuesFilter.value : emptyArray;
    return (
      <UiFloatingFilter
        items={props.uniqueValues}
        label="Search"
        valueGetter={(x) => x.label?.toString()?.toLowerCase()}
        renderItems= {
          (items) => (
            <UiSelectList
              items={items}
              onChange={
                (selection) => {
                  props.onColumnFilterChange(
                    (selection.length > 0) ? "in" : null,
                    selection,
                  );
                }
              }
              style={
                {
                  height: 40 + props.uniqueValues.length * 28,
                  maxHeight: props.height ?? "max(144px, calc(60vh - 256px))",
                }
              }
              value={selectedValues}
              valueProperty="value"
            />
          )
        }
      >
        <Divider />
        <Box
          alignItems="center"
          display="flex"
          flexDirection="row-reverse"
          justifyContent="space-between"
        >
          <Button
            color="primary"
            disabled={selectedValues.length === 0}
            onClick={() => props.onColumnFilterChange(null)}
          >
            Clear
          </Button>
        </Box>
      </UiFloatingFilter>
    );
  }
);

DataColumnFilterByValues.displayName = "DataColumnFilterByValues";

DataColumnFilterByValues.propTypes = {
  filter: DataFilter,
  height: PropTypes.number,
  onColumnFilterChange: PropTypes.func.isRequired,
  uniqueValues: PropTypes.array,
};

export default DataColumnFilterByValues;
