import React from "react";
import PropTypes from "prop-types";

import { drawShape } from "../utils/drawing";
import { ThemeDef } from "../utils/prop-types";

class Shape extends React.PureComponent {

  canvasRef = React.createRef()

  componentDidMount() {
    this.redraw();
  }

  componentDidUpdate() {
    this.redraw();
  }

  redraw() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShape(
      ctx,
      this.props.width / 2,
      this.props.width / 2,
      this.props.size,
      this.props.shape,
      this.props.colour,
      this.props.isHighlighted ? this.props.theme.primary.main : null,
    );
  }

  render() {
    return (
      <canvas
        ref={this.canvasRef}
        width={this.props.width}
        height={this.props.height}
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
