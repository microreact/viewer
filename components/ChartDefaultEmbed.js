import PropTypes from "prop-types";
import React from "react";
import { Handler } from "vega-tooltip";
import { Vega } from "react-vega";
// import debounce from "lodash.debounce";

// import "../styles/chart-pane.css";
import { createSelector } from "reselect";
import ChartControls from "../containers/ChartControls.react";
import { ChartTypes } from "../utils/prop-types";
import { exportPNG, exportSVG, isVegaLiteSpec, vegaLiteToVega } from "../utils/charts";
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

  customChartSpecSelector = createSelector(
    (props) => props.spec,
    (
      spec,
    ) => {
      if (spec) {
        const vlSpec = JSON.parse(spec);
        return vlSpec;
      }
      else {
        return undefined;
      }
    },
  );

  vegaLiteSpecSelector = (props) => {
    if (props.chartType === "custom") {
      return this.customChartSpecSelector(props);
    }

    // if (props.chartType === "heatmap") {
    //   return heatmapSpecSelector(state, chartId);
    // }

    if (props.chartType) {
      return defaultSpecSelector(state, chartId);
    }

    return undefined;
  };

  vegaSpecSelector = createSelector(
    (props) => this.vegaLiteSpecSelector(props),
    (props) => props.width,
    (props) => props.height,
    (
      spec,
      width,
      height,
    ) => {
      if (!spec) {
        return undefined;
      }

      const vlSpec = {
        ...spec,
      };

      if (isVegaLiteSpec(vlSpec)) {
        vlSpec.data = { name: "table" };
      }
      else if (!vlSpec.data) {
        vlSpec.data = [ { name: "table" } ];
      }

      if (!vlSpec.padding) {
        vlSpec.padding = { left: 8, top: 32, right: 8, bottom: 8 };
      }

      if (vlSpec.width === "auto") {
        vlSpec.width = width;
      }
      if (vlSpec.height === "auto") {
        vlSpec.height = height;
      }

      const vgSpec = vegaLiteToVega(vlSpec);

      return vgSpec;
    }
  );

  render() {
    const { props } = this;

    const vegaSpec = this.vegaSpecSelector(props);

    if (vegaSpec instanceof Error) {
      return (
        <div className="mr-error">
          { vegaSpec.message }
        </div>
      );
    }

    if (vegaSpec) {
      return (
        <Vega
          logLevel={2}
          onError={handleError}
          onParseError={handleParseError}
          // ref={this.vegaRef}
          signalListeners={props.signalListeners}
          tooltip={new Handler().call}
          data={props.chartData}
          spec={vegaSpec}
        />
      );
    }

    return null;
  }
}

ChartPane.propTypes = {
  chartData: PropTypes.shape({
    table: PropTypes.arrayOf(
      PropTypes.object.isRequired,
    ).isRequired,
  }).isRequired,
  chartId: PropTypes.string.isRequired,
  chartType: ChartTypes,
  signalListeners: PropTypes.object,
};

export default ChartPane;
