
import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import ZoomInRoundedIcon from "@material-ui/icons/ZoomInRounded";
import ZoomOutMapRoundedIcon from "@material-ui/icons/ZoomOutMapRounded";
import ZoomOutRoundedIcon from "@material-ui/icons/ZoomOutRounded";

import "../css/zoom-controls.css";

const ZoomControls = (props) => (
  <div
    className={
      classnames("mr-zoom-controls", props.className)
    }
    draggable="false"
    data-html2canvas-ignore="true"
  >
    <div
      className="mr-button"
      title="Zoom in"
      onClick={props.onZoomIn}
    >
      <ZoomInRoundedIcon />
    </div>
    <div className="mr-divider" />
    {
      props.onReset && (
        <React.Fragment>
          <div
            className="mr-button"
            title="Zoom in"
            onClick={props.onReset}
          >
            <ZoomOutMapRoundedIcon />
          </div>
          <div className="mr-divider" />
        </React.Fragment>
      )
    }
    {
      props.children && (
        <React.Fragment>
          {props.children}
          <div className="mr-divider" />
        </React.Fragment>
      )
    }
    <div
      className="mr-button"
      title="Zoom out"
      onClick={props.onZoomOut}
    >
      <ZoomOutRoundedIcon />
    </div>
  </div>
);

ZoomControls.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onReset: PropTypes.func,
  onZoomIn: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired,
};

export default ZoomControls;
