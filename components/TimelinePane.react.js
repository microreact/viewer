import PropTypes from "prop-types";
import React from "react";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";

import "../css/timeline-pane.css";

import * as Datetime from "../utils/datetime";
import { downloadDataUrl } from "../utils/downloads";

import TimelineSlider from "../containers/TimelineSlider.react";
import TimelineControls from "../containers/TimelineControls.react";
import TimelineFullRangeChart from "../containers/TimelineFullRangeChart.react";
import TimelineFilteredRangeChart from "../containers/TimelineFilteredRangeChart.react";
import { exportPNG, exportSVG } from "../utils/charts";

function formatRange(bounds, unit) {
  const length = Datetime.rangeLength(bounds, unit);
  return `${length} ${unit}${length !== 1 ? "s" : ""}`;
}

class TimelinePane extends React.PureComponent {

  static propTypes = {
    // chartData: PropTypes.shape({
    //   dataset: PropTypes.arrayOf(
    //     PropTypes.object.isRequired,
    //   ).isRequired,
    // }).isRequired,
    timelineId: PropTypes.string.isRequired,
    className: PropTypes.string,
    controls: PropTypes.bool,
    height: PropTypes.number.isRequired,
    onSelectItem: PropTypes.func.isRequired,
    chartSpec: PropTypes.object,
    width: PropTypes.number.isRequired,
  }

  state = {
    vegaError: null,
  }

  filteredRangeChartRef = React.createRef()

  signalListeners = {
    onItemSelect: (_, [ event, item ]) => {
      if (item) {
        this.props.onSelectItem(item, event.metaKey || event.ctrilKey);
      }
      else {
        this.props.onSelectItem(false);
      }
    },
  }

  downloadPNG = async () => {
    const dataUrl = await exportPNG(this.filteredRangeChartRef.current);
    downloadDataUrl(
      dataUrl,
      "timeline.png",
      "image/png",
    );
  }

  downloadSVG = async () => {
    const dataUrl = await exportSVG(this.filteredRangeChartRef.current);
    downloadDataUrl(
      dataUrl,
      "timeline.svg",
      "image/svg+xml",
    );
  }

  handleMinBoundChange = (event) => {
    const timestamp = Datetime.ISODateToTimestamp(event.target.value);
    if (Datetime.isTimestamp(timestamp)) {
      const bounds = [ ...this.props.bounds ];
      bounds[0] = timestamp;
      this.props.onChange(bounds);
    }
  }

  handleMaxBoundChange = (event) => {
    const timestamp = Datetime.ISODateToTimestamp(event.target.value);
    if (Datetime.isTimestamp(timestamp)) {
      const bounds = [ ...this.props.bounds ];
      bounds[1] = timestamp;
      this.props.onChange(bounds);
    }
  }

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

        {
          (!props.silderOnly) && (
            <TimelineFilteredRangeChart
              timelineId={props.timelineId}
              signalListeners={this.signalListeners}
              ref={this.filteredRangeChartRef}
            />
          )
        }

        <TimelineFullRangeChart
          timelineId={props.timelineId}
        />

        <TimelineSlider
          timelineId={props.timelineId}
          width={props.width - 32}
          height={48}
        />

        {
          (!props.silderOnly) && (
            <div className="mr-time-range">
              <Paper
                // className="mr-time-bounds"
              >
                <InputBase
                  onChange={this.handleMinBoundChange}
                  type="date"
                  value={Datetime.timestampToISODate(props.bounds[0])}
                />
                <Divider orientation="vertical" />
                <span>
                  { formatRange(props.bounds, props.unit) }
                </span>
                <Divider orientation="vertical" />
                <InputBase
                  onChange={this.handleMaxBoundChange}
                  type="date"
                  value={Datetime.timestampToISODate(props.bounds[1])}
                />
              </Paper>
            </div>
          )
        }

        <TimelineControls
          onDownloadPNG={this.downloadPNG}
          onDownloadSVG={this.downloadSVG}
          timelineId={props.timelineId}
        />
      </div>
    );
  }
}

export default TimelinePane;
