import React from "react";
import PropTypes from "prop-types";

import FilterButtons from "./FilterPane.react";
import Button from "./Button.react";
import { DataColumn } from "../utils/prop-types";

const Component = (props) => (
  <FilterButtons
    activeFields={[ props.labelFilter ]}
    columns={props.labelColumns}
    header="Labels"
    description="This will display text next to nodes in all views"
    onFilterChange={props.onLabelFilterChange}
  >
    <Button
      label="None"
      isActive={props.labelFilter === null}
      onClick={() => props.onLabelFilterChange()}
    />
  </FilterButtons>
);

Component.propTypes = {
  labelFilter: PropTypes.string,
  labelColumns: PropTypes.arrayOf(DataColumn.isRequired).isRequired,
  onLabelFilterChange: PropTypes.func.isRequired,
};

export default Component;
