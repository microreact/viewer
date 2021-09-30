import PropTypes from "prop-types";
import React from "react";
import { Handler } from "vega-tooltip";
import { Vega } from "react-vega";
// import debounce from "lodash.debounce";

import "../css/chart-pane.css";
import ChartControls from "../containers/ChartControls.react";
import { ChartTypes } from "../utils/prop-types";
import { exportPNG, exportSVG } from "../utils/charts";
import { downloadDataUrl } from "../utils/downloads";

const noScrollStyle = {};
const scrollStyle = {
  overflow: "auto",
};

const handleError = (err) => {
  // if (this.state.vegaError !== err.message) {
  //   this.setState({ vegaError: err.message });
  // }
  console.error("vega error", err);
};

const handleParseError = (err) => {
  // if (this.state.vegaError !== err.message) {
  //   this.setState({ vegaError: err.message });
  // }
  console.error("vega parse error", err);
};

class Chart extends React.PureComponent {

  static propTypes = {
    chartData: PropTypes.shape({
      table: PropTypes.arrayOf(
        PropTypes.object.isRequired,
      ).isRequired,
    }).isRequired,
    chartId: PropTypes.string.isRequired,
    chartType: ChartTypes,
    className: PropTypes.string,
    onSelectItem: PropTypes.func.isRequired,
    vegaSpec: PropTypes.object,
  }

  state = {
    vegaError: null,
  }

  vegaRef = React.createRef()

  // debouncedSelectItem = debounce(
  //   this.props.onSelectItem,
  //   200,
  // );

  signalListeners = {
    onItemSelect: (_, [ event, item ] = []) => {
      event?.stopPropagation();
      if (item) {
        this.props.onSelectItem(item, event.metaKey || event.ctrilKey);
      }
      else {
        this.props.onSelectItem(false);
      }
    },
    // brush: (_, item) => {
    //   const keys = Object.keys(item);
    //   if (keys.length === 0) {
    //     this.debouncedSelectItem(false);
    //   }
    //   else {
    //     this.debouncedSelectItem(item);
    //   }
    // },
    // onItemSelect: (event, item) => {
    // if (item) {
    //   for (const row of this.props.chartData.table) {
    //     if (
    //       (!this.props.xAxisField || row[this.props.xAxisField] === item[this.props.xAxisField])
    //       &&
    //       (!this.props.yAxisField || row[this.props.yAxisField] === item[this.props.yAxisField])
    //       &&
    //       (!this.props.seriesField || row[this.props.seriesField] === item[this.props.seriesField])
    //     ) {
    //       this.props.setHighlightedIds([ row.__id ]);
    //       break;
    //     }
    //   }
    // }
    // },
  }

  downloadPNG = async () => {
    const dataUrl = await exportPNG(this.vegaRef.current);
    downloadDataUrl(
      dataUrl,
      "chart.png",
      "image/png",
    );
  }

  downloadSVG = async () => {
    const dataUrl = await exportSVG(this.vegaRef.current);
    downloadDataUrl(
      dataUrl,
      "chart.svg",
      "image/svg+xml",
    );
  }

  render() {
    const { props } = this;

    return (
      <div
        className="mr-chart"
        style={
          props.chartType === "custom" ? scrollStyle : noScrollStyle
        }
      >
        <div
          className="mr-chart"
          onClick={this.signalListeners.onItemSelect}
        >
          {
            (props.vegaSpec instanceof Error) && (
              <div className="mr-error">
                { props.vegaSpec.message }
              </div>
            )
          }
          {
            props.vegaSpec && (
              <Vega
                data={this.props.chartData}
                logLevel={2}
                onError={handleError}
                // onNewView={
                //   () => {
                //     if (this.state.vegaError !== null) {
                //       this.setState({ vegaError: null });
                //     }
                //   }
                // }
                onParseError={handleParseError}
                ref={this.vegaRef}
                signalListeners={this.signalListeners}
                spec={props.vegaSpec}
                tooltip={new Handler().call}
              />
            )
          }
        </div>

        <ChartControls
          chartId={this.props.chartId}
          onDownloadPNG={this.downloadPNG}
          onDownloadSVG={this.downloadSVG}
        />
      </div>
    );
  }
}

export default Chart;
