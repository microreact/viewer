import React from "react";
import { Vega } from "react-vega";

const onError = (err) => console.error("Timeline", err);
const onParseError = (err) => console.error("Timeline", err);

const TimelineFullRangeChart = React.memo(
  (props) => {
    return (
      <Vega
        data={props.chartData}
        onError={onError}
        onParseError={onParseError}
        spec={props.chartSpec}
        className="mr-timelime-full-range-chart"
      >
      </Vega>
    );
  }
);

TimelineFullRangeChart.displayName = "TimelineFullRangeChart";

export default TimelineFullRangeChart;
