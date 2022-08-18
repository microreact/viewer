import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import UiFloatingFilter from "./UiFloatingFilter.react";
import UiRadioList from "./UiRadioList.react";

import { DataColumn } from "../utils/prop-types";

const UiFieldsList = React.memo(
  (props) => {
    return (
      <UiFloatingFilter
        className={
          classnames(
            "mr-ui-fields-list",
            props.className,
          )
        }
        items={props.columns}
        label="Search columns"
        renderItems={
          (items) => (
            <UiRadioList
              items={items}
              onChange={props.onChange}
              value={props.value}
              valueProperty="name"
            />
          )
        }
      />
    );
  },
);

UiFieldsList.displayName = "UiFieldsList";

UiFieldsList.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.arrayOf(DataColumn),
  nullable: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

UiFieldsList.defaultProps = {
};

export default UiFieldsList;
