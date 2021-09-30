/* eslint-disable class-methods-use-this */
import React from "react";
import NProgress from "nprogress";
import PropTypes from "prop-types";
import classnames from "classnames";

import "../css/loading.css";

class Loading extends React.PureComponent {
  static displayName = "Loading";

  static propTypes = {
    children: PropTypes.node,
  }

  state = {
    hidden: true,
  }

  componentDidMount() {
    this.timeoutID = setTimeout(
      () => {
        NProgress.start();
        this.setState({ hidden: false });
      },
      1000,
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID);
    NProgress.done();
  }

  render() {
    return (
      <div
        className={
          classnames(
            "mr-loading",
            { "mr-hidden": this.state.hidden },
          )
        }
      >
        <div>
          <img src="/images/logos/microreact.svg" />
          <p>
            Loading project
          </p>
        </div>
      </div>
    );
  }
}

export default Loading;
