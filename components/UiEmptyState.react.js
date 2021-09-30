/* eslint-disable class-methods-use-this */
import React from "react";
import Typography from "@material-ui/core/Typography";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";

import "../css/ui-empty-state.css";

function UiEmptyState(props) {
  return (
    <div className="mr-ui-empty-state">
      <div className="icon">
        { props.icon }
      </div>
      <Typography
        variant="h5"
        color="textPrimary"
      >
        { props.title }
      </Typography>
      {
        props.subtitle && (
          <Typography
            variant="subtitle1"
            color="textPrimary"
          >
            { props.subtitle }
          </Typography>
        )
      }
    </div>
  );
}

UiEmptyState.defaultProps = {
  icon: (<WorkOutlineIcon />),
};

export default UiEmptyState;
