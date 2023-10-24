import PropTypes from "prop-types";
import React from "react";

import Paper from "@mui/material/Paper";
import TimelineSlider from "../containers/TimelineSlider.react.js";
import TimelineControls from "../containers/TimelineControls.react.js";
import TimelineFullRangeChart from "../containers/TimelineFullRangeChart.react.js";
import TimelineFilteredRangeChart from "../containers/TimelineFilteredRangeChart.react.js";

import { downloadDataUrl } from "../utils/downloads.js";
import { exportPNG, exportSVG } from "../utils/charts.js";

import TimeLineRange from "./TimelineRange.react.js";

class TimelinePane extends React.PureComponent {
  state = {
    vegaError: null,
  };

  filteredRangeChartRef = React.createRef();

  signalListeners = {
    onItemSelectSignal: (_, [event, item]) => {
      if (item) {
        this.props.onSelectItem(item, event.metaKey || event.ctrilKey);
      }
      else {
        this.props.onSelectItem(false);
      }
    },
  };

  downloadPNG = async () => {
    const dataUrl = await exportPNG(this.filteredRangeChartRef.current);
    downloadDataUrl(
      dataUrl,
      "timeline.png",
      "image/png",
    );
  };

  downloadSVG = async () => {
    const dataUrl = await exportSVG(this.filteredRangeChartRef.current);
    downloadDataUrl(
      dataUrl,
      "timeline.svg",
      "image/svg+xml",
    );
  };

  render() {
    const { props } = this;

    if (props.bounds === null) {
      return false;
    }

    return (
      <div
        className="mr-timeline-pane"
        style={
          {
            height: props.height,
            width: props.width,
          }
        }
      >

        <TimelineFilteredRangeChart
          timelineId={props.timelineId}
          signalListeners={this.signalListeners}
          ref={this.filteredRangeChartRef}
        />

        <TimelineFullRangeChart
          timelineId={props.timelineId}
        />

        <TimelineSlider
          timelineId={props.timelineId}
          width={props.width - 32}
          height={48}
        />
        <div className="mr-time-range">
          <Paper>
            <TimeLineRange
              bounds={props.bounds}
              onTimelineFilter={props.onTimelineFilter}
              unit={props.unit}
            />
          </Paper>
        </div>
        <TimelineControls
          onDownloadPNG={this.downloadPNG}
          onDownloadSVG={this.downloadSVG}
          timelineId={props.timelineId}
        />
      </div>
    );
  }
}

TimelinePane.propTypes = {
  bounds: PropTypes.array,
  chartSpec: PropTypes.object,
  className: PropTypes.string,
  controls: PropTypes.bool,
  height: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  onTimelineFilter: PropTypes.func.isRequired,
  timelineId: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
};

export default TimelinePane;
