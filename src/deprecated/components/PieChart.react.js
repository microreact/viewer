import React from "react";
import PropTypes from "prop-types";

const size = 100;
const radCircumference = Math.PI * 2;
const center = size / 2;
const radius = center - 1; // padding to prevent clipping

/**
 * Generates an SVG pie chart.
 * @see {http://wiki.scribus.net/canvas/Making_a_Pie_Chart}
 */
export default class PieChart extends React.PureComponent {

  state = {
    tooltip: "",
  }

  renderPaths() {
    // const total = slices.reduce((totalValue, { value }) => totalValue + value, 0);

    let radSegment = 0;
    let lastX = radius;
    let lastY = 0;

    return Object.keys(this.props.slices).map((color, index) => {
      const value = this.props.slices[color];

      // Should we just draw a circle?
      if (value === 1) {
        return (
          <circle
            r={radius}
            cx={center}
            cy={center}
            fill={color}
            key={index}
            onClick={(event) => this.props.onSliceClick(event, color, value)}
          />
        );
      }

      if (value === 0) {
        return null;
      }

      const valuePercentage = value;

      // Should the arc go the long way round?
      const longArc = (valuePercentage <= 0.5) ? 0 : 1;

      radSegment += valuePercentage * radCircumference;
      const nextX = Math.cos(radSegment) * radius;
      const nextY = Math.sin(radSegment) * radius;

      // d is a string that describes the path of the slice.
      // The weirdly placed minus signs [eg, (-(lastY))] are due to the fact
      // that our calculations are for a graph with positive Y values going up,
      // but on the screen positive Y values go down.
      const d = [
        `M ${center},${center}`,
        `l ${lastX},${-lastY}`,
        `a${radius},${radius}`,
        "0",
        `${longArc},0`,
        `${nextX - lastX},${-(nextY - lastY)}`,
        "z",
      ].join(" ");

      lastX = nextX;
      lastY = nextY;

      return (
        <path
          d={d}
          fill={color}
          // fill={color === "transparent" ? "var(--background-main)" : color}
          key={index}
          onClick={(event) => this.props.onSliceClick(event, color, value)}
          onMouseOver={() =>
            this.setState({
              tooltip: Math.round(this.props.total * value),
            })
          }
        />
      );
    });
  }

  render() {
    return (
      <svg
        viewBox={`0 0 ${size} ${size}`}
        style={this.props.style}
        className="mr-piechart"
      >
        <circle cx="50" cy="50" r="50" className="border" /> :
        <g
          transform="scale(1,-1) translate(0,-100)"
          onMouseLeave={() => this.setState({ tooltip: "" })}
        >
          { this.renderPaths() }
        </g>
        {
          this.props.donut ?
            <circle cx="50" cy="50" r="25" className="donut" /> :
            null
        }
        <text x="50" y="50">
          { this.state.tooltip }
          { this.state.tooltip ? "/" : null }
          { this.props.total }
        </text>
      </svg>
    );
  }

}

PieChart.propTypes = {
  stroked: PropTypes.bool,
  donut: PropTypes.bool,
  slices: PropTypes.object.isRequired,
  style: PropTypes.object,
  onSliceClick: PropTypes.func,
  total: PropTypes.number.isRequired,
};
