import React from "react";
import PropTypes from "prop-types";

import { drawShape } from "../utils/svg";
import { ThemeDef } from "../utils/prop-types";

class Shape extends React.PureComponent {

  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={this.props.width}
        height={this.props.height}
      >
        <g
          fill={this.props.colour}
          stroke={this.props.borderColour}
          linewidth={this.props.borderWidth}
          dangerouslySetInnerHTML= {
            {
              __html: drawShape(
                this.props.width / 2,
                this.props.height / 2,
                this.props.size,
                this.props.shape,
                this.props.colour,
                this.props.isHighlighted ? this.props.theme.primary.main : null,
              ),
            }
          }
        />
      </svg>
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
