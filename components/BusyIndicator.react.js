import PropTypes from "prop-types";
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

// import "../styles/busy-indicator.css";

const BusyIndicator = React.memo(
  (props) => {
    if (props.isBuzy) {
      return (
        <div className="mr-busy-indicator">
          <CircularProgress
            size={430}
            thickness={1}
          />
        </div>
      );
    }
    else {
      return null;
    }
  }
);

BusyIndicator.displayName = "BusyIndicator";

BusyIndicator.propTypes = {
  isBuzy: PropTypes.bool.isRequired,
};

export default BusyIndicator;
