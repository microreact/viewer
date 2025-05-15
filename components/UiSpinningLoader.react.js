import React from "react";
import PropTypes from "prop-types";

// import "../styles/ui-spinning-loader.css";

const UiSpinningLoader = React.memo(
  (props) => (
    <div
      className="mr-ui-spinning-loader"
    >
      <div>
        { props.children }
      </div>
    </div>
  )
);

UiSpinningLoader.displayName = "UiSpinningLoader";

UiSpinningLoader.propTypes = {
  children: PropTypes.node,
};

export default UiSpinningLoader;
