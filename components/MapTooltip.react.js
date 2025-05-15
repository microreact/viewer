import React from "react";
import PropTypes from "prop-types";
import { Popup } from "react-map-gl";
import { sum } from "d3-array";

import { countryCodeToName } from "../utils/maps";
import { calculatePercentage } from "../utils/number";

const MapTooltip = React.memo(
  (props) => {
    if (props.region) {
      const properties = [];

      for (const key of Object.keys(props.region.properties)) {
        if (key === "mr-region-id") {
          continue;
        }

        if (key === "ISO 3166-1 alpha-2") {
          properties.push(
            <div key={key}>
              <strong>{countryCodeToName(props.region.properties[key])}</strong> ({props.region.properties[key]})
            </div>
          );
        }
        else {
          properties.push(
            <div key={key}>
              {key}: <strong>{props.region.properties[key]}</strong>
            </div>
          );
        }
      }

      const numberOfRowsInRegion = sum(
        props.rowsByRegion[props.region.properties["mr-region-id"]],
        (x) => x["--mr-scalar"] ?? 1,
      );
      const totalRowCountInRegion = props.totalRowCountByRegion[props.region.properties["mr-region-id"]];
      const labels = [];
      if (totalRowCountInRegion === 0) {
        labels.push(<div key="empty">No data</div>);
      }
      else if (numberOfRowsInRegion !== totalRowCountInRegion) {
        labels.push(
          <div key="count">
            <strong>{ numberOfRowsInRegion }</strong>
            { " out of " }
            <strong>{ totalRowCountInRegion }</strong>
            &nbsp;
            { (totalRowCountInRegion === 1) ? props.entryLabels[0] : props.entryLabels[1] }
            { " (" }
            { calculatePercentage(numberOfRowsInRegion, totalRowCountInRegion) }
            { "%)" }
          </div>
        );
      }
      else {
        labels.push(
          <div key="count">
            <strong>{ totalRowCountInRegion }</strong> { (totalRowCountInRegion === 1) ? props.entryLabels[0] : props.entryLabels[1] }
          </div>
        );
      }

      return (
        <Popup
          closeButton={false}
          latitude={props.latitude}
          longitude={props.longitude}
        >
          <center>Region</center>
          <hr/>
          { labels }
          { properties }
        </Popup>
      );
    }
    else if (props.marker) {
      return (
        <Popup
          closeButton={false}
          latitude={props.latitude}
          longitude={props.longitude}
          className="mr-tooltip"
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
        </Popup>
      );
    }

    return null;
  }
);

MapTooltip.displayName = "MapTooltip";

MapTooltip.propTypes = {
  entryLabels: PropTypes.array.isRequired,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  marker: PropTypes.object,
  region: PropTypes.object,
  rowsByRegion: PropTypes.object,
  totalRowCountByRegion: PropTypes.object,
};

export default MapTooltip;
