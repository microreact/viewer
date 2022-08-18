import PropTypes from "prop-types";
import React from "react";

import DropFiles from "../containers/DropFiles.react";
import NetworkPane from "../containers/NetworkPane.react";

class NetworkPlaceholder extends React.PureComponent {

  static propTypes = {
    networkId: PropTypes.string.isRequired,
    hasNetwork: PropTypes.bool.isRequired,
  }

  static defaultProps = {
  }

  state = {
  }

  render() {
    const { props } = this;

    if (props.hasNetwork) {
      return (
        <NetworkPane
          {...props}
        />
      );
    }

    return (
      <div className="mr-placeholder mr-network-placeholder">
        <DropFiles
          fileKind="network"
          paneId={props.networkId}
        />
      </div>
    );
  }

}

export default NetworkPlaceholder;
