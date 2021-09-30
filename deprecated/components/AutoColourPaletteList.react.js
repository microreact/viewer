import PropTypes from "prop-types";
import React from "react";

import ContinuousColourPaletteList from "./ContinuousColourPaletteList.react";
import DiscreteColourPaletteList from "./DiscreteColourPaletteList.react";

const AutoColourPaletteList = React.memo(
  (props) => {
    if (props.type === "discrete") {
      return (
        <DiscreteColourPaletteList {...props} />
      );
    }

    if (props.type === "continuous") {
      return (
        <ContinuousColourPaletteList {...props} />
      );
    }
  }
);

AutoColourPaletteList.displayName = "AutoColourPaletteList";

AutoColourPaletteList.propTypes = {
  type: PropTypes.string,
};

export default AutoColourPaletteList;
