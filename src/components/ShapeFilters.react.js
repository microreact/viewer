import React from "react";
import PropTypes from "prop-types";

import FilterButtons from "./FilterPane.react";
import Button from "./Button.react";
import { DataColumn } from "../utils/prop-types";

const Component = (props) => (
  <FilterButtons
    activeFields={[ props.shapeFilter ]}
    columns={props.shapeColumns}
    header="Shapes"
    description="This will update shapes in all views"
    onFilterChange={props.onShapeFilterChange}
  >
    <Button
      label={props.colourFilter ? "Same as colour" : "Default"}
      isActive={!props.shapeFilter}
      onClick={() => props.onShapeFilterChange()}
    />
  </FilterButtons>
);

Component.propTypes = {
  colourFilter: PropTypes.string,
  shapeFilter: PropTypes.string,
  shapeColumns: PropTypes.arrayOf(DataColumn.isRequired).isRequired,
  onShapeFilterChange: PropTypes.func.isRequired,
};

export default Component;
