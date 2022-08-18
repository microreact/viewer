import React from "react";
import classnames from "classnames";

export default (props) => (
  <div
    className={classnames("libmr-ControlsMenu-group", props.className)}
  >
    { props.children }
  </div>
);
