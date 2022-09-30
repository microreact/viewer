import React from "react";
import PropTypes from "prop-types";

const MapTooltip = React.memo(
  (props) => {
    if (props.region) {
      const properties = [];

      for (const key of Object.keys(props.region.properties)) {
        if (key !== "mr-region-id") {
          properties.push(
            <div key={key}>
              {key}: <strong>{props.region.properties[key]}</strong>
            </div>
          );
        }
      }

      const numberOfRowsInRegion = props.rowsByRegion[props.region.properties["mr-region-id"]].length;
      return (
        <div
          className="mr-tooltip"
          style={{ left: props.x + 4, top: props.y + 4 }}
        >
          <center>Region</center>
          <hr/>
          <div>{ numberOfRowsInRegion } { (numberOfRowsInRegion === 1) ? "entry" : "entries" }.</div>
          { properties }
        </div>
      );
    }
    else if (props.marker) {
      return (
        <div
          className="mr-tooltip"
          style={{ left: props.x + 4, top: props.y + 4 }}
        >
          <center>Marker</center>
          <hr/>
          <div>Location: { props.marker.position.join(", ") }</div>
          {
            (props.marker.rows.length === 1)
              ?
              (
                <div>Row ID: { props.marker.rows[0][0] }</div>
              )
              :
              (
                <div>{ props.marker.rows.length } rows.</div>
              )
          }
        </div>
      );
    }

    return null;
  }
);

MapTooltip.displayName = "MapTooltip";

MapTooltip.propTypes = {
  marker: PropTypes.object,
  region: PropTypes.object,
  rowsByRegion: PropTypes.object,
  x: PropTypes.number,
  y: PropTypes.number,
};

export default MapTooltip;
