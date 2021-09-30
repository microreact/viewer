import { Vega } from "react-vega";
import { Handler } from "vega-tooltip";

import filteredRangeChartDataSelector from "../selectors/timelines/filtered-range-chart-data";
import filteredRangeChartSpecSelector from "../selectors/timelines/filtered-range-chart-spec";
import { connectToPresentStateWithRef } from "../utils/state";

const onError = (err) => console.error("Timeline", err);
const onParseError = (err) => console.error("Timeline", err);

const handler = new Handler({ theme: "timeline" });

const mapStateToProps = (state, { timelineId }) => {
  return {
    className: "mr-timeline-filtered-range-chart",
    data: filteredRangeChartDataSelector(state, timelineId),
    onError,
    onParseError,
    spec: filteredRangeChartSpecSelector(state, timelineId),
    tooltip: handler.call,
  };
};

const mapDispatchToProps = null;

export default connectToPresentStateWithRef(Vega, mapStateToProps, mapDispatchToProps);
