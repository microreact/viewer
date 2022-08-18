import FastForwardRoundedIcon from "@material-ui/icons/FastForwardRounded";
import FastRewindRoundedIcon from "@material-ui/icons/FastRewindRounded";
import PauseRoundedIcon from "@material-ui/icons/PauseRounded";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import PropTypes from "prop-types";
import React from "react";
import SkipNextRoundedIcon from "@material-ui/icons/SkipNextRounded";
import SkipPreviousRoundedIcon from "@material-ui/icons/SkipPreviousRounded";
import Slider from "@material-ui/core/Slider";
import MenuIcon from "@material-ui/icons/Menu";
import Divider from "@material-ui/core/Divider";
import { createSelector } from "reselect";

import { timeUnits, timeSpeeds } from "../constants";
import { DataColumn } from "../utils/prop-types";

import UiAnimation from "./UiAnimation.react";
import UiControlsMenu from "./UiControlsMenu.react";
import UiRadioList from "./UiRadioList.react";
import UiControlsButton from "./UiControlsButton.react";
import UiFieldsList from "./UiFieldsList.react";
import UiDropdownMenu from "./UiDropdownMenu.react";

const timelineSyles = [
  { label: "Bar Chart", value: "bar" },
  { label: "Normalised Bar Chart", value: "normalised-bar" },
  // { label: "Bubble Chart", value: "bubble" },
];

const timelineUnits = (
  Object.entries(timeUnits)
    .map(
      ([ value, label ]) => ({
        value,
        label,
      })
    )
);

export default class TimelineControls extends React.PureComponent {

  state = {
    isPlaying: false,
    isMovingWindow: false,
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.isPlaying !== this.state.isPlaying) {
  //     if (this.state.isPlaying) {
  //       this.startTimelinePlay();
  //     } else {
  //       this.stopTimelinePlay();
  //     }
  //   }
  // }

  componentWillUnmount() {
    this.stopTimelinePlay();
  }

  marksSelector = createSelector(
    (props) => props.fullRangeChartData,
    (
      { dataset },
    ) => {
      const marks = [];

      if (dataset && dataset.length) {
        for (const binData of dataset) {
          marks.push(binData.unitStartDate.valueOf());
        }

        marks.push(dataset[dataset.length - 1].unitEndDate.valueOf());
      }

      return marks;
    },
  )

  boundsIndecies = () => {
    const { props } = this;
    const [ lowerTimestamp, upperTimestamp ] = props.silderTemporalRange;

    const marks = this.marksSelector(props);

    let lowerIndex;
    let upperIndex;
    for (const mark of marks) {
      if (lowerIndex === undefined && mark >= lowerTimestamp) {
        lowerIndex = marks.indexOf(mark);
      }
      if (mark <= upperTimestamp) {
        upperIndex = marks.indexOf(mark);
      }
    }

    return [
      lowerIndex,
      upperIndex,
    ];
  }

  moveBounds = (startDelta, endDelta) => {
    const { props } = this;
    const [ lowerIndex, upperIndex ] = this.boundsIndecies();

    const minIndex = lowerIndex + startDelta;
    const maxIndex = upperIndex + endDelta;

    const marks = this.marksSelector(props);

    if (minIndex >= 0 && maxIndex <= marks.length - 1) {
      props.onBoundsChange([
        marks[minIndex],
        marks[maxIndex],
      ]);
    }

    return maxIndex >= marks.length - 1;
  }

  playTimeline(event) {
    if (this.state.isPlaying) {
      this.stopTimelinePlay();
      this.setState({
        isPlaying: false,
      });
    }
    else {
      this.startTimelinePlay();
      this.setState({
        isPlaying: true,
        isMovingWindow: event.metaKey || event.ctrlKey,
      });
    }
  }

  startTimelinePlay() {
    this.props.onUnitChange(this.props.chartUnit);
    this.timerTick(true);
  }

  stopTimelinePlay() {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
    }
    this.timeoutID = null;
  }

  timerTick(rewind = false) {
    const { props } = this;
    const isFinished = this.moveBounds(this.state.isMovingWindow ? +1 : 0, +1);
    if (isFinished) {
      if (rewind) {
        const [ lowerIndex, upperIndex ] = this.boundsIndecies();
        this.moveBounds(-lowerIndex, 1 - upperIndex);
        this.timeoutID = setTimeout(() => this.timerTick(), props.speed * 1000);
      }
      else {
        this.setState({ isPlaying: false });
      }
    }
    else {
      this.timeoutID = setTimeout(() => this.timerTick(), props.speed * 1000);
    }
  }

  render() {
    const { props } = this;
    return (
      <div className="mr-main-controls">
        <UiDropdownMenu
          button={UiControlsButton}
          icon={<MenuIcon />}
        >
          {
            !props.isReadOnly && (
              <React.Fragment>
                <UiDropdownMenu.Item
                  onClick={props.onEditPane}
                >
                  Edit Timeline
                </UiDropdownMenu.Item>

                <Divider />
              </React.Fragment>
            )
          }

          <UiDropdownMenu.Item
            onClick={props.onDownloadPNG}
          >
            Download as PNG image
          </UiDropdownMenu.Item>
          <UiDropdownMenu.Item
            onClick={props.onDownloadSVG}
          >
            Download as SVG image
          </UiDropdownMenu.Item>
        </UiDropdownMenu>

        <UiControlsButton
          active={props.controls}
          onClick={() => props.onControlsChange(!props.controls)}
        />
        <UiAnimation in={props.controls}>
          <UiControlsButton
              onClick={
                () => {
                  const [ , upperIndex ] = this.boundsIndecies();
                  const marks = this.marksSelector(props);
                  const delta = (marks.length - 1) - upperIndex;
                  if (delta > 0) {
                    this.moveBounds(delta, delta);
                  }
                }
              }
            >
              <SkipNextRoundedIcon />
            </UiControlsButton>

          <UiControlsButton
            onClick={() => this.moveBounds(+1, +1)}
          >
            <FastForwardRoundedIcon />
          </UiControlsButton>

          <UiControlsButton
            onClick={(event) => this.playTimeline(event)}
            title={this.state.isPlaying ? "Pause" : "Play timeline. Hold Ctrl/Cmd + click for moving window."}
          >
            { this.state.isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon /> }
          </UiControlsButton>

          <UiControlsButton
            onClick={() => this.moveBounds(-1, -1)}
          >
            <FastRewindRoundedIcon />
          </UiControlsButton>

          <UiControlsButton
            onClick={
              () => {
                const [ lowerIndex ] = this.boundsIndecies();
                if (lowerIndex > 0) {
                  this.moveBounds(-lowerIndex, -lowerIndex);
                }
              }
            }
          >
            <SkipPreviousRoundedIcon />
          </UiControlsButton>

          <hr />

          <UiControlsMenu
            title="Speed"
            hideOnClick
          >
            <UiRadioList
              items={Object.keys(timeSpeeds).map(
                (key) => ({
                  value: key,
                  label: `1 ${props.chartUnit} per ${timeSpeeds[key]}`,
                })
              )}
              onChange={(value) => props.onSpeedChange(parseInt(value, 10))}
              value={props.speed.toString()}
            />
          </UiControlsMenu>

          <UiControlsMenu
            title="Unit"
            hideOnClick
          >
            <UiRadioList
              nullable
              nullOptionLabel="Auto"
              items={timelineUnits}
              onChange={props.onUnitChange}
              value={props.unit}
            />
          </UiControlsMenu>

          {
            (props.style === "bubble") && (
              <UiControlsMenu
                title="Stack by"
                hideOnClick
                onClear={props.laneField && (() => props.onStackByFieldChange())}
              >
                <UiFieldsList
                  columns={props.dataFields}
                  onChange={(value) => props.onStackByFieldChange(value)}
                  value={props.laneField}
                />
              </UiControlsMenu>
            )
          }

          <UiControlsMenu
            className="mr-timeline-points-menu"
            title="Type"
          >
            <UiRadioList
              items={timelineSyles}
              onChange={props.onStyleChange}
              value={props.style}
            />
            {
              (props.style === "bubble") && (
                <React.Fragment>
                  <hr />
                  <label>
                    Max Bubble Size: <strong>{props.nodeSize}</strong> pixels
                  </label>
                  <Slider
                    max={props.maxNodeSize}
                    min={props.minNodeSize}
                    onChange={(event, value) => props.onNodeSizeChange(value)}
                    value={props.nodeSize}
                  />
                </React.Fragment>
              )
            }
          </UiControlsMenu>
        </UiAnimation>
      </div>
    );
  }

}

TimelineControls.displayName = "TimelineControls";

TimelineControls.propTypes = {
  controls: PropTypes.bool.isRequired,
  dataFields: PropTypes.arrayOf(DataColumn).isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  laneField: PropTypes.string,
  maxNodeSize: PropTypes.number.isRequired,
  minNodeSize: PropTypes.number.isRequired,
  nodeSize: PropTypes.number.isRequired,
  onBoundsChange: PropTypes.func.isRequired,
  onControlsChange: PropTypes.func.isRequired,
  onDownloadPNG: PropTypes.func.isRequired,
  onDownloadSVG: PropTypes.func.isRequired,
  onEditPane: PropTypes.func.isRequired,
  onNodeSizeChange: PropTypes.func.isRequired,
  onSpeedChange: PropTypes.func.isRequired,
  onStackByFieldChange: PropTypes.func.isRequired,
  onStyleChange: PropTypes.func.isRequired,
  onUnitChange: PropTypes.func.isRequired,
  silderTemporalRange: PropTypes.array.isRequired,
  speed: PropTypes.number.isRequired,
  style: PropTypes.string.isRequired,
  unit: PropTypes.string,
};
