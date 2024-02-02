import PropTypes from "prop-types";
import React from "react";

import MatrixControls from "../containers/MatrixControls.js";
import MatrixChart from "../containers/MatrixChart.js";

const styleSelector = (props) => {
  return {
    "height": props.height,
    "overflowX": "hidden",
    "overflowY": "hidden",
    "width": props.width,
  };
};

class MattixPane extends React.PureComponent {

  vegaRef = React.createRef();

  // downloadPNG = async () => {
  //   const dataUrl = await exportPNG(this.vegaRef.current);
  //   downloadDataUrl(
  //     dataUrl,
  //     "chart.png",
  //     "image/png",
  //   );
  // };

  // downloadSVG = async () => {
  //   const dataUrl = await exportSVG(this.vegaRef.current);
  //   downloadDataUrl(
  //     dataUrl,
  //     "chart.svg",
  //     "image/svg+xml",
  //   );
  // };

  render() {
    const { props } = this;

    return (
      <div
        className="mr-matrix"
        style={styleSelector(props)}
      >
        <MatrixChart
          matrixId={this.props.matrixId}
          height={props.height}
          width={props.width}
        />

        <MatrixControls
          matrixId={this.props.matrixId}
          onDownloadPNG={this.downloadPNG}
          onDownloadSVG={this.downloadSVG}
        />
      </div>
    );
  }
}

MattixPane.propTypes = {
  matrixId: PropTypes.string.isRequired,
  className: PropTypes.string,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default MattixPane;
