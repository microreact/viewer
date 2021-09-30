import React from "react";
import PropTypes from "prop-types";

import { shapeImage } from "../utils/svg";
import { ThemeDef } from "../utils/prop-types";

class Shape extends React.PureComponent {

  render() {
    return (
      <img
        width={this.props.width}
        height={this.props.height}
        src={
          shapeImage(
            this.props.width,
            this.props.height,
            this.props.size,
            this.props.shape,
            this.props.colour,
            this.props.borderWidth,
            this.props.borderColour,
          )
        }
      />
    );
  }
}

Shape.displayName = "Shape";

Shape.propTypes = {
  borderColour: PropTypes.string,
  borderWidth: PropTypes.number,
  colour: PropTypes.string,
  height: PropTypes.number,
  isHighlighted: PropTypes.bool,
  shape: PropTypes.string,
  size: PropTypes.number,
  theme: ThemeDef,
  width: PropTypes.number,
};

Shape.defaultProps = {
  borderColour: "rgba(0, 0, 0, 0.56)",
  borderWidth: 1,
  height: 32,
  shape: "circle",
  size: 7,
  width: 32,
};

export default Shape;
