import PropTypes from "prop-types";
import React from "react";
import { createSelector } from "reselect";

import { ChartTypes } from "../utils/prop-types";
import { exportPNG, exportSVG } from "../utils/charts";
import { downloadDataUrl } from "../utils/downloads";

import GraphChart from "../containers/GraphChart.js";
import PieChart from "../containers/PieChart.js";
import ChartControls from "../containers/ChartControls.react";
import ChartCustomEmbed from "../containers/ChartCustomEmbed";
import ChartDefaultEmbed from "../containers/ChartDefaultEmbed";
import PieChartControls from "./PieChartControls.js";
import MultiVariableBarChart from "./MultiVariableBarChart.js";
import MultiVariableBarChartControls from "./MultiVariableBarChartControls.js";
import HeatmapChartControls from "./HeatmapChartControls.js";
import HeatmapChart from "./HeatmapChart.js";

// import "../styles/chart-pane.css";

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

class ChartPane extends React.PureComponent {

  state = {
    vegaError: null,
  };

  vegaRef = React.createRef();

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
  };

  styleSelector = createSelector(
    (props) => props.chartType,
    (props) => props.width,
    (props) => props.height,
    (
      chartType,
      width,
      height,
    ) => {
      if (chartType === "custom") {
        return {
          height,
          overflow: "auto",
          width,
        };
      }
      else {
        return {
          height,
          overflowX: "hidden",
          overflowY: "auto",
          width,
        };
      }
    },
  );

  downloadPNG = async () => {
    const dataUrl = await exportPNG(this.vegaRef.current);
    downloadDataUrl(
      dataUrl,
      "chart.png",
      "image/png",
    );
  };

  downloadSVG = async () => {
    const dataUrl = await exportSVG(this.vegaRef.current);
    downloadDataUrl(
      dataUrl,
      "chart.svg",
      "image/svg+xml",
    );
  };

  renderChartEmbed() {
    const { props } = this;

    if (props.chartType === "graph") {
      return (
        <GraphChart
          chartId={props.chartId}
          height={props.height}
          width={props.width}
          onClick={this.signalListeners.onItemSelectSignal}
        />
      );
    }

    if (props.chartType === "heatmap") {
      return (
        <HeatmapChart
          chartId={props.chartId}
          height={props.height}
          width={props.width}
          onClick={this.signalListeners.onItemSelectSignal}
        />
      );
    }

    if (props.chartType === "multi-variable-bar") {
      return (
        <MultiVariableBarChart
          chartId={props.chartId}
          height={props.height}
          width={props.width}
          onClick={this.signalListeners.onItemSelectSignal}
        />
      );
    }

    if (props.chartType === "piechart") {
      return (
        <PieChart
          chartId={props.chartId}
          height={props.height}
          width={props.width}
          onClick={this.signalListeners.onItemSelectSignal}
        />
      );
    }

    if (props.chartType === "custom") {
      return (
        <ChartCustomEmbed
          chartId={props.chartId}
          chartRef={this.vegaRef}
          height={props.height}
          onClick={this.signalListeners.onItemSelectSignal}
          onError={handleError}
          onParseError={handleParseError}
          signalListeners={this.signalListeners}
          width={props.width}
        />
      );
    }

    if (props.chartType) {
      return (
        <ChartDefaultEmbed
          chartId={props.chartId}
          chartRef={this.vegaRef}
          height={props.height}
          onClick={this.signalListeners.onItemSelectSignal}
          onError={handleError}
          onParseError={handleParseError}
          signalListeners={this.signalListeners}
          width={props.width}
        />
      );
    }

    return undefined;
  }

  renderChartControls() {
    const { props } = this;

    if (props.chartType === "piechart") {
      return (
        <PieChartControls chartId={props.chartId} />
      );
    }

    if (props.chartType === "heatmap") {
      return (
        <HeatmapChartControls chartId={props.chartId} />
      );
    }

    if (props.chartType === "multi-variable-bar") {
      return (
        <MultiVariableBarChartControls chartId={props.chartId} />
      );
    }

    return (
      <ChartControls
        chartId={this.props.chartId}
        onDownloadPNG={this.downloadPNG}
        onDownloadSVG={this.downloadSVG}
      />
    );
  }

  render() {
    const { props } = this;

    return (
      <div
        className="mr-chart"
        style={this.styleSelector(props)}
      >
        { this.renderChartEmbed() }
        { this.renderChartControls() }
      </div>
    );
  }
}

ChartPane.propTypes = {
  chartId: PropTypes.string.isRequired,
  chartType: ChartTypes,
  className: PropTypes.string,
  height: PropTypes.number.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
};

export default ChartPane;
