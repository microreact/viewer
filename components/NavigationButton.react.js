import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const items = {
  blocks: "view_comfy",
  filters: "remove_red_eye",
  history: "history",
  legend: "list",
  table: "grid_on",
  timeline: "access_time",
  timechart: "timeline",
};

const NavigationButton = (props) => (
  <button
    className={
      classnames(
        "mdl-button mdl-js-button mdl-button--icon mr-icon-button",
        { active: props.isActive }
      )
    }
    onClick={() => props.onClick(props.name)}
    title={
      classnames(
        props.isActive ? "Hide" : "Show",
        props.label
      )
    }
  >
    <i className="material-icons">{ items[props.name] }</i>
  </button>
);

NavigationButton.propTypes = {
  isActive: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default NavigationButton;
