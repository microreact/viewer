import React from "react";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";
import AutoSizer from "react-virtualized-auto-sizer";

import { DELAY, MIN_WIDTH, MIN_HEIGHT } from "../defaults";

export default class extends React.PureComponent {

  static displayName = "AutoSizer"

  static propTypes = {
    args: PropTypes.object,
    component: PropTypes.func.isRequired,
    minHeight: PropTypes.number,
    minWidth: PropTypes.number,
  }

  static defaultProps = {
    minHeight: MIN_HEIGHT,
    minWidth: MIN_WIDTH,
  }

  state = {
    height: 0,
    width: 0,
  }

  handleResize = debounce(
    ({ width, height }) => this.setState({
      width: Math.max(this.props.minWidth, width),
      height: Math.max(this.props.minHeight, height),
    }),
    DELAY
  );

  // renderComponent(component, identifier) {
  //   const { width, height } = this.state;
  //   if (height && width) {
  //     return React.createElement(component, { width, height, identifier });
  //   }
  //   return null;
  // }

  render() {
    const { width, height } = this.state;
    return (
      <AutoSizer
        onResize={this.handleResize}
      >
        {
          () => (height && width) > 0 &&
            React.createElement(
              this.props.component,
              {
                ...this.props.args,
                width,
                height,
              }
            )
        }
      </AutoSizer>
    );
  }

}
