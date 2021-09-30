import { connect } from "react-redux";
import { Vega } from "react-vega";

import fullRangeChartSpecSelector from "../selectors/timelines/full-range-chart-spec";
import fullRangeChartDataSelector from "../selectors/timelines/full-range-chart-data";

const onError = (err) => console.error("Timeline", err);
const onParseError = (err) => console.error("Timeline", err);

const mapStateToProps = (state, { timelineId }) => {
  return {
    data: fullRangeChartDataSelector(state, timelineId),
    onError,
    onParseError,
    spec: fullRangeChartSpecSelector(state, timelineId),
    className: "mr-timeline-full-range-chart",
  };
};

const mapDispatchToProps = null;

export default connect((state, props) => mapStateToProps(state.present, props), mapDispatchToProps)(Vega);
