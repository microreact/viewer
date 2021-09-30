import "../css/side-pane.css";

import React from "react";
import PropTypes from "prop-types";

import FiltersPane from "./FiltersPane.react";
import HistoryPane from "../containers/History.react";

const components = {
  filters: FiltersPane,
  history: HistoryPane,
};

const SidePane = (props) => (
  <div className="mr-side-pane">
    <button
      className="mr-side-pane-close mdl-button mdl-button--icon"
      onClick={() => props.onSidePaneChange(null)}
    >
      <i className="material-icons">close</i>
    </button>
    <div className="mr-side-pane-contents">
      { React.createElement(components[props.activeSidePane]) }
    </div>
  </div>
);

SidePane.propTypes = {
  activeSidePane: PropTypes.string,
  onSidePaneChange: PropTypes.func.isRequired,
};

export default SidePane;
