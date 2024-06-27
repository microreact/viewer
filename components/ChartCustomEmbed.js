import PropTypes from "prop-types";
import React from "react";
import { Handler } from "vega-tooltip";
import { Vega } from "react-vega";

import { createSelector } from "reselect";
import { convertChartSpec } from "../utils/charts";

class ChartCustomEmbed extends React.PureComponent {

  vegaSpecSelector = createSelector(
    (props) => props.spec,
    (props) => props.width,
    (props) => props.height,
    (
      spec,
      width,
      height,
    ) => {
      if (spec) {
        const vlSpec = JSON.parse(spec);
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

ChartCustomEmbed.propTypes = {
  chartData: PropTypes.shape({
    table: PropTypes.arrayOf(
      PropTypes.object.isRequired,
    ).isRequired,
  }).isRequired,
  chartRef: PropTypes.object,
  height: PropTypes.number,
  onError: PropTypes.func,
  onParseError: PropTypes.func,
  signalListeners: PropTypes.object,
  width: PropTypes.number,
};

export default ChartCustomEmbed;
