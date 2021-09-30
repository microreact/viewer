import "../css/header.css";

import React from "react";
import PropTypes from "prop-types";

import HeaderMenu from "./HeaderMenu.react";

import { exportFile } from "../utils/downloads";

class ExportMenu extends React.Component {

  static displayName = "ExportMenu"

  static propTypes = {
    hasMap: PropTypes.bool.isRequired,
    hasNetwork: PropTypes.bool.isRequired,
    hasTimeline: PropTypes.bool.isRequired,
    hasTree: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
  }

  render() {
    const { id } = this.props;
    return (
      <HeaderMenu
        icon="insert_photo"
        title="Export image"
      >
        <button
          onClick={() => exportFile("layout-png", id)}
        >
          Export Page (.png)
        </button>
        <hr />
        <button
          onClick={() => exportFile("legend-png", `${id}-legend`)}
        >
          Export Legend (.png)
        </button>
        {
          this.props.hasMap &&
          <button
            onClick={() => exportFile("map-png", `${id}-map`)}
          >
            Export Map (.png)
          </button>
        }
        {
          this.props.hasNetwork &&
          <button
            onClick={() => exportFile("network-png", `${id}-network`)}
          >
            Export Network (.png)
          </button>
        }
        {
          this.props.hasNetwork &&
          <button
            onClick={() => exportFile('network-svg', `${id}-network`)}
          >
            Export Network (.svg)
          </button>
        }
        {
          this.props.hasTimeline &&
          <button
            onClick={() => exportFile("timeline-png", `${id}-timeline`)}
          >
            Export Timeline (.png)
          </button>
        }
        {
          this.props.hasTree &&
          <button
            onClick={() => exportFile("tree-png", `${id}-tree`)}
          >
            Export Tree (.png)
          </button>
        }
        {
          this.props.hasTree &&
          <button
            onClick={() => exportFile("tree-svg", `${id}-tree`)}
          >
            Export Tree (.svg)
          </button>
        }
      </HeaderMenu>
    );
  }
}

export default ExportMenu;
