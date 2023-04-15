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
          onError={props.handleError}
          onParseError={props.handleParseError}
          ref={props.chartRef}
          signalListeners={props.signalListeners}
          spec={vegaSpec}
          tooltip={new Handler().call}
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
  handleError: PropTypes.func,
  handleParseError: PropTypes.func,
  signalListeners: PropTypes.object,
};

export default ChartCustomEmbed;
