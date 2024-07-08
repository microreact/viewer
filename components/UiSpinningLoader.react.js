import React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";

const UiSpinningLoader = React.memo(
  (props) => (
    <div
      className="mr-ui-spinning-loader"
    >
      <div
        className="progress"

      >
        <CircularProgress
          size={60}
          color={"primary"}
        />
      </div>
      <div>
        {props.children}
      </div>
    </div>
  )
);

UiSpinningLoader.displayName = "UiSpinningLoader";

UiSpinningLoader.propTypes = {
  children: PropTypes.node,
};

export default UiSpinningLoader;
