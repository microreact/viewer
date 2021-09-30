import PropTypes from "prop-types";
import React from "react";
import { scaleLinear } from "d3-scale";

import "../css/colour-palette.css";
import { StylePalette } from "../utils/prop-types";

const ColourPalette = React.memo((props) => {
  const range = [
    Array.isArray(props.palette.entries[0]) ? props.palette.entries[0][1] : props.palette.entries[0],
    Array.isArray(props.palette.entries[props.palette.entries.length - 1]) ? props.palette.entries[props.palette.entries.length - 1][1] : props.palette.entries[props.palette.entries.length - 1],
  ];

  const numberOfBins = props.palette.bins || props.bins;

  if (numberOfBins === 0) {
    return (
      <div
        className="mr-colour-palette"
        title={props.title}
        style={
          {
            background: `linear-gradient(0.25turn, ${range[0]}, ${range[1]})`,
          }
        }
      />
    );
  }

  else if (numberOfBins > 0) {
    const entries = [];
    const colourGetter = scaleLinear()
      .domain([ 1, numberOfBins ])
      .range(range);
    for (let index = 1; index <= numberOfBins; index++) {
      entries.push(
        <span
          key={index}
          style={{ backgroundColor: colourGetter(index) }}
        />
      );
    }
    return (
      <div
        className="mr-colour-palette"
        title={props.title}
      >
        { entries }
      </div>
    );
  }

  return (
    <div
      className="mr-colour-palette"
      title={props.title}
    >
      {
        props.palette.entries.map(
          (entry) => (
            <span
              key={Array.isArray(entry) ? entry[0] : entry}
              style={{ backgroundColor: Array.isArray(entry) ? entry[1] : entry }}
              title={Array.isArray(entry) ? `${entry[0]}: ${entry[1]}` : undefined}
            />
          )
        )
      }
    </div>
  );
});

ColourPalette.displayName = "ColourPalette";

ColourPalette.propTypes = {
  palette: StylePalette.isRequired,
  title: PropTypes.string,
};

export default ColourPalette;
