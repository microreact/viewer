import "../css/map-summary.css";

import React from "react";
import PropTypes from "prop-types";

import Icon from "./Shape.react";
import PieChart from "./PieChart.react";

import { getGroupedColours } from "../utils/drawing";
import { DataColumn } from "../utils/prop-types";

function getUniqueRows(rows, rowStyles) {
  const unique = {};

  for (const row of rows) {
    const style = rowStyles[row[0]];
    const shape = style.shape;
    const colour = style.colour;
    const label = style.label.trim();
    const key = `${shape} ${colour} ${label}`;
    if (key in unique) {
      unique[key].ids.push(row[0]);
    } else {
      unique[key] = {
        key,
        shape,
        colour,
        label,
        ids: [ row[0] ],
      };
    }
  }

  return Object.keys(unique).map((key) => unique[key]);
}

const InfoWindow = (props) => {
  const uniqueRows = getUniqueRows(props.rows, props.rowStyles);
  return (
    <div className="mr-map-summary">
      <div className="mr-chart">
        <PieChart
          donut
          slices={getGroupedColours(props.rows, props.rowStyles)}
          onSliceClick={(event, colour) => {
            const ids = [];
            for (const row of props.rows) {
              if (props.rowStyles[row[0]].colour === colour) {
                ids.push(row[0]);
              }
            }
            props.setHighlightedIds(ids, event.metaKey || event.ctrlKey);
          }}
          total={props.rows.length}
        />
      </div>
      <header className="mr-header">
        { (props.highlightedIds.size !== props.rows.length) ? `${props.highlightedIds.size} of ` : null }
        { props.rows.length } items
      </header>
      <ul className="mr-list">
        {
          uniqueRows.map((row) =>
            (
              <li key={row.key}>
                {
                  (props.labelFilter && props.labelFilter.type === "url") ?
                    <a
                      href={row.value}
                      title="Click to open external link"
                      target="_blank" // eslint-disable-line react/jsx-no-target-blank
                    >
                      <Icon
                        shape={row.shape}
                        colour={row.colour}
                        isHighlighted={row.ids.every((id) => props.highlightedIds.has(id))}
                      />
                      {row.label}
                    </a> :
                    <button
                      title={row.label}
                      onClick={(event) => {
                        props.setHighlightedIds(row.ids, event.metaKey || event.ctrlKey);
                      }}
                    >
                      <Icon
                        shape={row.shape}
                        colour={row.colour}
                        isHighlighted={row.ids.every((id) => props.highlightedIds.has(id))}
                      />
                      {row.ids.length} {row.label !== "" && `× ${row.label}`}
                    </button>
                }
              </li>
            )
          )
        }
      </ul>
      <button
        className="mr-close"
        onClick={props.onClose}
      >
        <i className="material-icons">arrow_drop_down</i>
      </button>
    </div>
  );
};

InfoWindow.displayName = "InfoWindow";

InfoWindow.propTypes = {
  highlightedIds: PropTypes.instanceOf(Set).isRequired,
  labelFilter: DataColumn.isRequired,
  onClose: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
  rowStyles: PropTypes.object.isRequired,
  setHighlightedIds: PropTypes.func.isRequired,
};

export default InfoWindow;
