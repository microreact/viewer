import { Vega } from "react-vega";

import selectionChartSpecSelector from "../selectors/filters/selection-chart-spec";
import selectionChartDataSelector from "../selectors/filters/selection-chart-data";
import { connectToPresentStateWithRef } from "../utils/state";

const onError = (err) => console.error("SelectionChart", err);
const onParseError = (err) => console.error("SelectionChart", err);

const mapStateToProps = (state) => {
  return {
    className: "mr-timeline-filtered-range-chart",
    data: selectionChartDataSelector(state),
    onError,
    onParseError,
    spec: selectionChartSpecSelector(state),
    // onNewView: console.debug,
  };
};

const mapDispatchToProps = null;

export default connectToPresentStateWithRef(Vega, mapStateToProps, mapDispatchToProps);
