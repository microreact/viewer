import React from "react";
import "leaflet-lassoselect";
import "../plugins/leaflet/canvas-marker-layer";
import classnames from "classnames";
import PropTypes from "prop-types";

import RectangularTreeIcon from "./RectangularTreeIcon.react";
import NetworkIcon from "./NetworkIcon.react";
import FileIcon from "./FileIcon.react";
import GridOnIcon from "@mui/icons-material/GridOn";
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import QueryBuilderRoundedIcon from '@mui/icons-material/QueryBuilderRounded';

// import "../styles/new-tab.css";

const htmlEscapes = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#39;",
};
const unescapedHtml = /[&<>"']/g;

export default class extends React.PureComponent {

  static displayName = "NewTab"

  static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  }

  state = {
  }

  render() {
    return (
      <div
        className="mr-new-tab"
        style={
          {
            width: this.props.width,
            height: this.props.height,
          }
        }
      >
        <div className="mr-buttons">
          <button>
            <RectangularTreeIcon />
          </button>
          <button>
            <NetworkIcon />
          </button>
          <button>
            <GridOnIcon />
          </button>
          <button>
            <BarChartRoundedIcon />
          </button>
          <button>
            <PublicRoundedIcon />
          </button>
          <button>
            <QueryBuilderRoundedIcon />
          </button>
        </div>
      </div>
    );
  }

}
