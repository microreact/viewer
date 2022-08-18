import "../css/side-nav.css";

import React from "react";
import PropTypes from "prop-types";

import NavigationButton from "./NavigationButton.react";
import Tour from "../containers/Tour.react";

const SideNav = ({ activeSidePane, onSidePaneChange }) => (
  <div className="mr-side-nav">
    <Tour
      id="sidepane"
      pointer="right"
      style={{ top: "36px", right: "36px" }}
    />
    <NavigationButton
      name="filters"
      label="Labels, Shapes, & Colours"
      isActive={activeSidePane === "filters"}
      onClick={onSidePaneChange}
    />
    <NavigationButton
      name="history"
      label="Project History"
      isActive={activeSidePane === "history"}
      onClick={onSidePaneChange}
    />
  </div>
);

SideNav.propTypes = {
  activeSidePane: PropTypes.string,
  onSidePaneChange: PropTypes.func.isRequired,
};

export default SideNav;
