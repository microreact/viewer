import "../css/tour.css";

import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import CtrlKey from "./CtrlKey.react";
import AltlKey from "./AltlKey.react";

const titles = {
  map: "Map Pane",
  network: "Network Pane",
  search: "Search Box",
  sidepane: "Side Pane",
  table: "Data Table",
  timeline: "Timeline",
  tree: "Tree Pane",
  welcome: "Introducing The New Microreact",
};

const contents = {
  map: (
    <React.Fragment>
      Points which contain more than one row are rendered as a piechart on the map,
      click on a point to view details.
      Use the <i className="material-icons mr-btn">tune</i> button to show/hide map controls.
    </React.Fragment>
  ),
  network: (
    <React.Fragment>
      Network nodes can be dragged using the mouse pointer.
      Use <kbd>Alt</kbd> + click on a node to select the node and all of its neighbors.
      Use the <i className="material-icons mr-btn">tune</i> button to show/hide network controls.
    </React.Fragment>
  ),
  search: (
    <React.Fragment>
      Use this search box to search in all column.
      The <i className="material-icons">explicit</i> button toggles between exact and partial match modes.
    </React.Fragment>
  ),
  sidepane: (
    <React.Fragment>
      Label, Shape, and Colour settings are found in the side pane <i className="material-icons mr-btn">remove_red_eye</i>.
      <br />
      The new side pane also includes project (tree) history <i className="material-icons mr-btn">history</i>.
    </React.Fragment>
  ),
  table: (
    <React.Fragment>
      Click on the filter button (<i className="material-icons">filter_list</i>) in a header to search in that column.
      Use the <i className="material-icons mr-btn">tune</i> button to change table row display density or choose visible columns.
    </React.Fragment>
  ),
  timeline: (
    <React.Fragment>
      Drag the edges of the slider to set filter timeline.
      Use {CtrlKey} + mouse scroll to zoom timeline points horizontally, or {AltlKey} + scroll to zoom vertically.
      Use the <i className="material-icons mr-btn">tune</i> button to show/hide timeline controls.
    </React.Fragment>
  ),
  tree: (
    <React.Fragment>
      Use {CtrlKey} + mouse scroll to scale tree branch lengths, or {AltlKey} + scroll to change space between branches.
      Use the <i className="material-icons mr-btn">tune</i> button to show/hide tree controls.
    </React.Fragment>
  ),
  welcome: (
    <React.Fragment>
      Take a quick tour of the new features in Microreact.
      You can re-start this tour any time from the Help menu <i className="material-icons">help</i> in the header above.
    </React.Fragment>
  ),
};

const Tour = (props) => {
  if (props.id !== props.currentStep) {
    return null;
  }

  return (
    <div className="mr-tour-container">
      <div
        className={classnames("mr-tour", `pointer-${props.pointer}`)}
        style={props.style}
      >
        <button
          className="mr-tour-close-button"
          title="End tour"
          onClick={() => props.onStepChange()}
        >
          <i className="material-icons">close</i>
        </button>
        <div className="mr-tour-header">
          { titles[props.currentStep] }
        </div>
        <div className="mr-tour-content">
          <p>{ contents[props.currentStep] }</p>
        </div>
        <div className="mr-tour-footer">
          <div className="mr-tour-subtext">
            {
              (props.currentStepIndex > 0) &&
            <React.Fragment>
              { props.currentStepIndex } / { props.totalSteps - 1 }
            </React.Fragment>
            }
          </div>
          {
            (props.previousStep) &&
          <button
            className="mdl-button"
            onClick={() => props.onStepChange(props.previousStep)}
          >
            Previous
          </button>
          }
          {
            (props.nextStep) &&
          <button
            className="mdl-button"
            onClick={() => props.onStepChange(props.nextStep)}
          >
            { props.currentStepIndex === 0 ? "Start Tour" : "Next" }
          </button>
          }
          {
            (!props.nextStep) &&
          <button
            className="mdl-button"
            onClick={() => props.onStepChange()}
          >
            End Tour
          </button>
          }
        </div>
        <div className="mr-pointer" />
      </div>
    </div>
  );
};

Tour.propTypes = {
  currentStep: PropTypes.string,
  currentStepIndex: PropTypes.number,
  id: PropTypes.string.isRequired,
  nextStep: PropTypes.string,
  onStepChange: PropTypes.func.isRequired,
  pointer: PropTypes.string.isRequired,
  previousStep: PropTypes.string,
  steps: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  style: PropTypes.object,
  totalSteps: PropTypes.number,
};

export default Tour;
