import PropTypes from "prop-types";
import React from "react";

import { Handler } from "vega-tooltip";
import { Vega } from "react-vega";

function handleError(err) {
  console.error("vega error", err);
}

function handleParseError(err) {
  console.error("vega parse error", err);
}

const VegaChart = React.memo(
  (props) => {
    if (props.spec instanceof Error) {
      return (
        <div className="mr-error">
          { props.spec.message }
        </div>
      );
    }

    if (props.spec) {
      return (
        <Vega
          data={props.data}
          logLevel={2}
          onError={handleError}
          onParseError={handleParseError}
          ref={props.chartRef}
          signalListeners={props.signalListeners}
          spec={props.spec}
          tooltip={new Handler().call}
          // onNewView={console.debug}
        />
      );
    }

    return null;
  }
);

VegaChart.displayName = "VegaChart";

VegaChart.propTypes = {
  data: PropTypes.shape({
    table: PropTypes.arrayOf(
      PropTypes.object.isRequired,
    ).isRequired,
  }).isRequired,
  chartRef: PropTypes.object,
  spec: PropTypes.object,
  signalListeners: PropTypes.object,
};

export default VegaChart;
