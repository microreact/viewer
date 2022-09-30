import React from "react";
import { Rnd } from "react-rnd";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";
import classnames from "classnames";

// import "../styles/timeline-slider.css";
import * as Datetime from "../utils/datetime";

import { nextFrame } from "../utils/browser";

export default class extends React.PureComponent {

  static displayName = "TimelineSlider"

  static propTypes = {
    height: PropTypes.number,
    max: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    trackSize: PropTypes.number,
    value: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    width: PropTypes.number.isRequired,
    padding: PropTypes.number,
  }

  static defaultProps = {
    height: 12,
    trackSize: 4,
    padding: 16,
  }

  state = {
    isDragging: false,
    bounds: null,
    pointer: null,
  }

  onChange = debounce(
    (bounds) => {
      if (this.state.bounds && (this.state.isDragging || this.state.isBrushing)) {
        this.props.onChange(bounds);
      }
    },
    200,
  );

  valueToPixel(value) {
    const dataRange = this.props.max - this.props.min;
    const pixel = (((value - this.props.min) / dataRange) * this.props.width);
    return pixel;
  }

  boundsToPixels(bounds) {
    // TODO: use `scaleUtc`
    const dataRange = this.props.max - this.props.min;
    const sliderStart = (((bounds[0] - this.props.min) / dataRange) * this.props.width);
    const sliderEnd = (((bounds[1] - this.props.min) / dataRange) * this.props.width);
    return {
      start: sliderStart,
      width: sliderEnd - sliderStart,
    };
  }

  pixelsToBounds(start, width) {
    const dataRange = this.props.max - this.props.min;
    const sliderStart = (start / this.props.width) * dataRange;
    const sliderEnd = ((start + width) / this.props.width) * dataRange;
    return [
      Math.max(sliderStart + this.props.min, this.props.min),
      Math.min(sliderEnd + this.props.min, this.props.max),
    ];
  }

  eventPoint = (event) => {
    return event.pageX - this.props.padding;
  }

  handleBrushMouseDown = (event) => {
    this.setState({
      isBrushing: true,
    });
  }

  handleBrushMouseMove = (event) => {
    const x = this.eventPoint(event);
    if (this.state.isBrushing) {
      if ((this.state.brushX ?? undefined) === undefined) {
        this.setState({
          pointerX: null,
          brushX: this.state.pointerX,
        });
      }
      else {
        const bounds = this.pixelsToBounds(
          Math.min(this.state.brushX, x),
          Math.abs(this.state.brushX - x),
        );
        this.setState({ bounds });
        this.onChange(bounds);
      }
    }
    else {
      this.setState({ pointerX: x });
    }
  }

  handleBrushMouseUp = (event) => {
    if (this.state.isBrushing) {
      const x = this.eventPoint(event);
      if (x !== this.state.brushX && this.state.brushX) {
        const bounds = this.pixelsToBounds(
          Math.min(this.state.brushX, x),
          Math.abs(this.state.brushX - x),
        );
        this.setState({ bounds });
        this.props.onChange(bounds);
        nextFrame(
          () => this.setState({
            bounds: null,
            pointerX: null,
            brushX: null,
            isBrushing: false,
          })
        );
      }
      else {
        this.setState({
          bounds: null,
          pointerX: null,
          brushX: null,
          isBrushing: false,
        });
      }
    }
  }

  render() {
    const { props } = this;

    if (props.value === null) {
      return null;
    }

    const timeBounds = this.state.bounds || props.value;
    const sliderBounds = this.boundsToPixels(timeBounds);
    const trackSize = {
      width: sliderBounds.width,
      height: 16,
    };
    const trackPosition = {
      x: sliderBounds.start,
      y: 0,
    };
    return (
      <div
        className={
          classnames(
            "mr-timeline-slider",
            { "mr-is-brushing": this.state.isBrushing }
          )
        }
        style={{ width: props.width, height: props.height }}
        onMouseUp={this.handleBrushMouseUp}
      >
        <div
          className="mr-range-box"
          style={
            {
              height: props.height,
              top: 0,
              left: trackPosition.x,
              width: sliderBounds.width,
            }
          }
        />

        <div
          className="mr-dimmers"
          style={{ width: props.width, height: props.height }}
          onMouseMove={this.handleBrushMouseMove}
          onMouseDown={this.handleBrushMouseDown}
        >
          <div
            className="mr-dimmer-before"
            style={{ width: sliderBounds.start }}
          >
          </div>
          <div
            className="mr-dimmer-after"
            style={{ width: props.width - trackSize.width - sliderBounds.start }}
          >
          </div>
          {
            this.state.pointerX && !this.state.isDragging && (
              <div
                className="mr-brush-pointer"
                style={{ left: this.state.pointerX + 1 }}
              />
            )
          }
        </div>

        <div
          className="mr-slider-rail"
          style={
            {
              top: props.height - trackSize.height,
              height: trackSize.height,
            }
          }
        >
          <Rnd
            bounds="parent"
            minWidth={1}
            maxWidth={props.width}
            minHeight={trackSize.height}
            maxHeight={trackSize.height}
            position={trackPosition}
            size={trackSize}
            onDrag={(e, delta) => {
              const bounds = this.pixelsToBounds(delta.x > 0 ? delta.x : 0, sliderBounds.width);
              this.setState({ bounds, isDragging: true });
              this.onChange(bounds);
            }}
            onDragStop={(e, delta) => {
              const bounds = this.pixelsToBounds(delta.x > 0 ? delta.x : 0, sliderBounds.width);
              this.setState({ bounds, isDragging: false });
              props.onChange(bounds);
              nextFrame(() => this.setState({ bounds: null, isDragging: false }));
            }}
            onResize={(e, direction, ref, delta, position) => {
              const bounds = this.pixelsToBounds(position.x > 0 ? position.x : 0, ref.offsetWidth);
              this.setState({ bounds, isDragging: true });
              this.onChange(bounds);
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              const bounds = this.pixelsToBounds(position.x > 0 ? position.x : 0, ref.offsetWidth);
              this.setState({ bounds, isDragging: false });
              props.onChange(bounds);
              nextFrame(() => this.setState({ bounds: null, isDragging: false }));
            }}
            className="mr-slider-track"
            enableResizing={{
              top: false,
              right: true,
              bottom: false,
              left: true,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            dragAxis="x"
            resizeHandleClasses={{
              left: "mr-slider-handle",
              right: "mr-slider-handle",
            }}
            resizeHandleStyles={{
              left: { height: props.height, width: 4, left: -2, top: trackSize.height - props.height },
              right: { height: props.height, width: 4, right: -2, top: trackSize.height - props.height },
            }}
            resizeHandleComponent={
              {
                left: (
                  <div
                    title={Datetime.timestampToDateString(props.value[0])}
                    style={{ height: "100%" }}
                    onDoubleClick={() => props.onChange([ props.min, props.value[1] ])}
                  />
                ),
                right: (
                  <div
                    title={Datetime.timestampToDateString(props.value[1])}
                    style={{ height: "100%" }}
                    onDoubleClick={() => props.onChange([ props.value[0], props.max ])}
                  />
                ),
              }
            }
          >
            <span
              className={
                classnames(
                  "mr-range-info",
                  { "mr-visible": this.state.isDragging || this.state.isBrushing },
                )
              }
            >
              { Datetime.rangeToDurationDistance(timeBounds) }
            </span>
            <div
              className="mr-track-hover"
              title="Drag to move range"
            />
          </Rnd>
        </div>
      </div>
    );
  }

}
