import React from "react";
import { Rnd } from "react-rnd";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";
import { LabelValuePair } from "../utils/prop-types";
import "../css/timeline-slider.css";

export default class extends React.PureComponent {

  static displayName = "TimelineSlider"

  static propTypes = {
    height: PropTypes.number,
    marks: PropTypes.arrayOf(LabelValuePair).isRequired,
    max: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    trackSize: PropTypes.number,
    value: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    valueToLabel: PropTypes.func,
    width: PropTypes.number.isRequired,
  }

  static defaultProps = {
    height: 12,
    trackSize: 4,
    valueToLabel: (value) => value.toString(),
  }

  state = {
    isDragging: false,
    bounds: null,
  }

  onChange = debounce(
    (bounds) => {
      if (this.state.bounds) {
        this.props.onChange(bounds);
      }
    },
    64,
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

  render() {
    const { props } = this;
    const sliderBounds = this.boundsToPixels(this.state.bounds || props.value);
    const offset = (props.height - props.trackSize) / 2;
    return (
      <div
        className="mr-range-slider"
        style={{ width: props.width, height: props.height }}
      >
        <div className="mr-slider-rail" style={{ top: offset, position: "absolute", left: 0, right: 0, bottom: offset }}></div>
        {
          props.marks.map((x) => (
            <div
              className="mr-slider-mark"
              key={x.label}
              style={
                {
                  bottom: offset,
                  left: this.valueToPixel(x.value) - (props.trackSize / 2),
                  position: "absolute",
                  top: offset,
                  width: props.trackSize,
                }
              }
              title={x.label}
            >
            </div>
          ))
        }
        <Rnd
          bounds="parent"
          minWidth={24}
          maxWidth={props.width}
          minHeight={props.height}
          maxHeight={props.height}
          position={{
            x: sliderBounds.start,
            y: 0,
          }}
          size={{
            width: sliderBounds.width,
            height: props.height,
          }}
          onDrag={(e, delta) => {
            const bounds = this.pixelsToBounds(delta.x > 0 ? delta.x : 0, sliderBounds.width);
            this.setState({ bounds });
            this.onChange(bounds);
          }}
          onDragStop={(e, delta) => {
            this.setState({ bounds: null });
            const bounds = this.pixelsToBounds(delta.x > 0 ? delta.x : 0, sliderBounds.width);
            props.onChange(bounds);
          }}
          onResize={(e, direction, ref, delta, position) => {
            const bounds = this.pixelsToBounds(position.x > 0 ? position.x : 0, ref.offsetWidth);
            this.setState({ bounds });
            this.onChange(bounds);
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            this.setState({ bounds: null });
            const bounds = this.pixelsToBounds(position.x > 0 ? position.x : 0, ref.offsetWidth);
            props.onChange(bounds);
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
            left: { height: props.height, width: props.height, zIndex: 1 },
            right: { height: props.height, width: props.height, zIndex: 1 },
          }}
          // style={{
          //   borderColor: "white",
          //   borderTopStyle: "solid",
          //   borderBottomStyle: "solid",
          //   borderWidth: offset,
          // }}
          resizeHandleComponent={
            {
              left: <div title={props.valueToLabel(props.value[0])} style={{ height: "100%" }} />,
              right: <div title={props.valueToLabel(props.value[1])} style={{ height: "100%" }} />,
            }
          }
        >
          <div className="mr-slider-bar" style={{ top: offset, position: "absolute", left: 0, right: 0, bottom: offset }}></div>
          {/* <small className="mr-start-date">
            { moment(props.chartData[Math.ceil(sliderBounds.min)].x).format("YYYY-MM-DD") }
          </small>
          <small className="mr-end-date">
            { moment(props.chartData[Math.floor(sliderBounds.max)].x).format("YYYY-MM-DD") }
          </small> */}
        </Rnd>
      </div>
    );
  }

}
