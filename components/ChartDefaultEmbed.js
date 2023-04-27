import PropTypes from "prop-types";
import React from "react";
import { Handler } from "vega-tooltip";
import { Vega } from "react-vega";
// import debounce from "lodash.debounce";

// import "../styles/chart-pane.css";
import { createSelector } from "reselect";
import ChartControls from "../containers/ChartControls.react";
import { ChartTypes } from "../utils/prop-types";
import { exportPNG, exportSVG, isVegaLiteSpec, vegaLiteToVega, convertChartSpec } from "../utils/charts";
import { downloadDataUrl } from "../utils/downloads";

class ChartDefaultEmbed extends React.PureComponent {

  vegaSpecSelector = createSelector(
    (props) => props.defaultSpec,
    (props) => props.width,
    (props) => props.height,
    (
      vlSpec,
      width,
      height,
    ) => {
      if (vlSpec) {
        return convertChartSpec(
          vlSpec,
          width,
          height,
        );
      }
      else {
        return undefined;
      }
    },
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
          data={props.chartData}
          logLevel={2}
          onError={props.onError}
          onParseError={props.onParseError}
          ref={props.chartRef}
          signalListeners={props.signalListeners}
          spec={vegaSpec}
          tooltip={new Handler().call}
          // onNewView={console.debug}
        />
      );
    }

    return null;
  }
}

ChartDefaultEmbed.propTypes = {
  chartData: PropTypes.shape({
    table: PropTypes.arrayOf(
      PropTypes.object.isRequired,
    ).isRequired,
  }).isRequired,
  chartId: PropTypes.string.isRequired,
  chartRef: PropTypes.object,
  chartType: ChartTypes,
  height: PropTypes.number.isRequired,
  onError: PropTypes.func,
  onParseError: PropTypes.func,
  signalListeners: PropTypes.object,
  width: PropTypes.number.isRequired,
};

export default ChartDefaultEmbed;
