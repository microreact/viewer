import PropTypes from "prop-types";
import React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

// import "../styles/timeline-pane.css";

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

function FilterMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleFilter = (filter) => {
    handleClose();
    props.onTimelineFilter(filter);
  };

  return (
    <div>
      <Button
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color="inherit"
        style={{ minWidth: 0, padding: 0 }}
      >
        <ArrowDropDownIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        dense
        onClose={handleClose}
        open={open}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => handleFilter("7-days")}>Last 7 days</MenuItem>
        <MenuItem onClick={() => handleFilter("14-days")}>Last 14 days</MenuItem>
        <MenuItem onClick={() => handleFilter("30-days")}>Last 30 days</MenuItem>
        <MenuItem onClick={() => handleFilter("3-months")}>Last 3 months</MenuItem>
        <MenuItem onClick={() => handleFilter("6-months")}>Last 6 months</MenuItem>
        <MenuItem onClick={() => handleFilter("12-months")}>Last 12 months</MenuItem>
      </Menu>
    </div>
  );
}

class TimelinePane extends React.PureComponent {

  static propTypes = {
    timelineId: PropTypes.string.isRequired,
    className: PropTypes.string,
    controls: PropTypes.bool,
    height: PropTypes.number.isRequired,
    onSelectItem: PropTypes.func.isRequired,
    chartSpec: PropTypes.object,
    width: PropTypes.number.isRequired,
  };

  state = {
    vegaError: null,
  };

  filteredRangeChartRef = React.createRef();

  signalListeners = {
    onItemSelectSignal: (_, [ event, item ]) => {
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

  handleMinBoundChange = (event) => {
    const timestamp = Datetime.ISODateToTimestamp(event.target.value);
    if (Datetime.isTimestamp(timestamp)) {
      const bounds = [ ...this.props.bounds ];
      bounds[0] = timestamp;
      this.props.onChange(bounds);
    }
  };

  handleMaxBoundChange = (event) => {
    const timestamp = Datetime.ISODateToTimestamp(event.target.value);
    if (Datetime.isTimestamp(timestamp)) {
      const bounds = [ ...this.props.bounds ];
      bounds[1] = timestamp;
      this.props.onChange(bounds);
    }
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
            <FilterMenu
              onTimelineFilter={props.onTimelineFilter}
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

export default TimelinePane;
