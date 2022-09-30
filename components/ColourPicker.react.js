import React from "react";
import PropTypes from "prop-types";

import { SketchPicker } from "react-color";

// import "../styles/colour-picker.css";
import UiPopover from "./UiPopover.react";

class ColourPicker extends React.PureComponent {
  state = {
    colour: null,
  };

  anchorRef = React.createRef();

  handleClick = () => {
    if (this.state.colour) {
      this.handleClose();
    }
    else {
      this.setState({ colour: this.props.value });
    }
  };

  handleClose = () => {
    const colour = this.state.colour;
    if (colour) {
      this.setState({ colour: null });
      this.props.onChange(colour);
    }
  };

  handleChange = (args) => {
    this.setState({ colour: args.hex });
  };

  render() {
    const currentValue = this.state.colour ?? this.props.value;
    return (
      <div
        className="mr-colour-picker"
        ref={this.anchorRef}
      >
        <div
          className="mr-swatch"
          onClick={ this.handleClick }
        >
          <div
            className="mr-colour"
            style={{ background: currentValue }}
          />
          <div
            className="mr-label"
          >
            { currentValue }
          </div>
        </div>
        {
          this.state.colour && (
            <UiPopover
              className="mr-colour-picker-dialog"
              isOpen
              onClose={this.handleClose}
              anchorEl={this.anchorRef.current}
            >
              <SketchPicker
                color={this.state.colour}
                onChange={ this.handleChange }
              />
            </UiPopover>
          )
        }
      </div>
    );
  }
}

ColourPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default ColourPicker;
