import PropTypes from "prop-types";
import React from "react";
import { Handler } from "vega-tooltip";
import { Vega } from "react-vega";
// import debounce from "lodash.debounce";

// import "../styles/chart-pane.css";
import ChartControls from "../containers/ChartControls.react";
import { ChartTypes } from "../utils/prop-types";
import { exportPNG, exportSVG } from "../utils/charts";
import { downloadDataUrl } from "../utils/downloads";

const noScrollStyle = {
  overflowX: "hidden",
  overflowY: "auto",
};
const autoScrollStyle = {
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
    onItemSelectSignal: (_, [ event, item ] = []) => {
      event?.stopPropagation();

      this.props.onSelectItem(
        (item?.datum) || item || false,
        event?.metaKey || event?.ctrilKey,
      );
      // if (!this.lastItemSelect) {
      //   this.lastItemSelect = 1;
      //   setTimeout(
      //     () => {
      //       if (this.lastItemSelect) {
      //         if (item) {
      //           this.props.onSelectItem(item, event.metaKey || event.ctrilKey);
      //         }
      //         else {
      //           this.props.onSelectItem(false);
      //         }
      //       }
      //       this.lastItemSelect = 0;
      //     },
      //     300,
      //   );
      // }
      // else {
      //   this.lastItemSelect = 0;
      //   if (item && this.props.seriesDataColumn) {
      //     this.lastSeriesSelect = new Date();
      //     const series = { ...item };
      //     delete series[this.props.seriesDataColumn.name];
      //     this.props.onSelectItem(series, event.metaKey || event.ctrilKey);
      //   }
      // }
    },
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
          props.chartType === "custom" ? autoScrollStyle : noScrollStyle
        }
      >
        <div
          className="mr-chart"
          onClick={this.signalListeners.onItemSelectSignal}
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
                //   (x) => {
                //     console.debug(x)
                //     // if (this.state.vegaError !== null) {
                //     //   this.setState({ vegaError: null });
                //     // }
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
