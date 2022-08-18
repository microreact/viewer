import React from "react";
import PropTypes from "prop-types";

import { shapeToImage } from "../utils/drawing";
import { ThemeDef } from "../utils/prop-types";

class Shape extends React.PureComponent {

  canvasRef = React.createRef()

  render() {
    return (
      <img
        width={this.props.width}
        height={this.props.height}
        src={
          shapeToImage(
            this.props.width / 2,
            this.props.height / 2,
            this.props.size,
            this.props.shape,
            this.props.colour,
            this.props.isHighlighted ? this.props.theme.primary.main : null,
          )
        }
      />
    );
  }
}

Shape.displayName = "Shape";

Shape.propTypes = {
  colour: PropTypes.string,
  height: PropTypes.number,
  isHighlighted: PropTypes.bool,
  size: PropTypes.number,
  shape: PropTypes.string,
  width: PropTypes.number,
  theme: ThemeDef,
};

Shape.defaultProps = {
  height: 32,
  size: 7,
  shape: "circle",
  width: 32,
};

export default Shape;
