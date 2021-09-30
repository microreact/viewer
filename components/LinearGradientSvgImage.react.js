import React from "react";
import PropTypes from "prop-types";

import { linearGradientImage } from "../utils/svg";

class LinearGradientSvgImage extends React.PureComponent {

  render() {
    return (
      <img
        width={this.props.width}
        height={this.props.height}
        src={
          linearGradientImage(
            this.props.width,
            this.props.height,
            this.props.startColour,
            this.props.stopColour,
          )
        }
      />
    );
  }
}

LinearGradientSvgImage.displayName = "LinearGradientSvgImage";

LinearGradientSvgImage.propTypes = {
  height: PropTypes.number,
  startColour: PropTypes.string,
  stopColour: PropTypes.string,
  width: PropTypes.number,
};

LinearGradientSvgImage.defaultProps = {
  height: 32,
  width: 32,
};

export default LinearGradientSvgImage;
