import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import MapTwoToneIcon from "@material-ui/icons/MapTwoTone";
import PropTypes from "prop-types";
import React from "react";

import "../css/map-legend.css";
import { DataColumn } from "../utils/prop-types";
import UiPopoverMenu from "./UiPopoverMenu.react";
import UiSlider from "./UiSlider.react";

class MapLegend extends React.PureComponent {

  state = {
    isExpanded: true,
  }

  selectRows = (value, event) => {
    const append = event.metaKey || event.ctrlKey;
    const rowIds = [];

    for (const marker of this.props.markers) {
      if (marker.magnitude === value) {
        for (const row of marker.rows) {
          rowIds.push(row[0]);
        }
      }
    }

    this.props.onSelectRows(rowIds, append);
  }

  toggleLegend = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  render() {
    const { props } = this;

    if (!this.state.isExpanded) {
      return (
        <div className="mr-map-legend-button"
          onClick={this.toggleLegend}
          title="Expand Legend"
        >
          <MapTwoToneIcon />
        </div>
      );
    }

    return (
      <div className="mr-map-legend">
        <CloseRoundedIcon
          onClick={this.toggleLegend}
          title="Collapse Legend"
        />
        <table>
          <tbody>
            <tr>
              {
                props.hasMarkerSizeLegend && (
                  <td>
                    <table
                      className="mr-legend-table"
                    >
                      <thead>
                        <tr>
                          <td
                            colSpan="2"
                            title={props.scaleMarkersDataField ? props.scaleMarkersDataField.name : "# entries"}
                          >
                            Marker<br/>Size
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          props.markerSizeLegendItems.map(
                            (item, index) => (
                              <tr key={item.value}>
                                <td>
                                  <svg
                                    width={`${props.maxScaledMarkerSize * 2 + 2}px`}
                                    height={`${item.radius * 2 + 2}px`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    onClick={(event) => this.selectRows(item.value, event)}
                                  >
                                    <circle
                                      cx={props.maxScaledMarkerSize + 1}
                                      cy={item.radius + 1}
                                      r={item.radius}
                                    />
                                  </svg>
                                </td>
                                {
                                  (index === 0 || index === props.markerSizeLegendItems.length - 1)
                                    ?
                                    (
                                      <UiPopoverMenu
                                        button="td"
                                        buttonProps={
                                          {
                                            children: item.value,
                                            className: "mr-action-button",
                                            title: "Click to set marker size",
                                          }
                                        }
                                        direction="right"
                                        title="Marker size"
                                      >
                                        {
                                          (index === 0)
                                            ?
                                            (
                                              <UiSlider
                                                label="Min marker size"
                                                max={128}
                                                min={1}
                                                onChange={(value) => (value < props.maxScaledMarkerSize) && props.onMinMarkerSizeChange(value)}
                                                unit="px"
                                                value={props.minScaledMarkerSize}
                                              />
                                            )
                                            :
                                            (
                                              <UiSlider
                                                label="Max marker size"
                                                max={128}
                                                min={1}
                                                onChange={(value) => (value > props.minScaledMarkerSize) && props.onMaxMarkerSizeChange(value)}
                                                unit="px"
                                                value={props.maxScaledMarkerSize}
                                              />
                                            )
                                        }
                                      </UiPopoverMenu>
                                    )
                                    :
                                    (
                                      <td>{ item.value }</td>
                                    )
                                }
                              </tr>
                            )
                          )
                        }
                      </tbody>
                    </table>
                  </td>
                )
              }
              {
                props.hasRegionColourLegend && (
                  <td>
                    <table
                      className="mr-legend-table"
                    >
                      <thead style={{ height: "16px" }}>
                        <tr>
                          <td
                            colSpan="2"
                            title={props.scaleMarkersDataField ? props.scaleMarkersDataField.name : "# entries"}
                          >
                            Region<br/>Colour
                          </td>
                        </tr>
                      </thead>
                      <tbody style={{ height: "calc(100% - 16px)" }}>
                        <tr>
                          <td
                            style={
                              {
                                background: `linear-gradient(${props.regionColourLegendItems[0]?.colour}, ${props.regionColourLegendItems[props.regionColourLegendItems.length - 1]?.colour})`,
                                minWidth: "8px",
                              }
                            }
                            rowSpan="2"
                          >
                            &nbsp;
                          </td>
                          <td
                            style={{ verticalAlign: "top", textAlign: "left" }}
                          >
                            &nbsp;{props.regionColourLegendItems[0]?.value}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ verticalAlign: "bottom", textAlign: "left" }}
                          >
                            &nbsp;{props.regionColourLegendItems[props.regionColourLegendItems.length - 1]?.value}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                )
              }
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

}

MapLegend.displayName = "MapLegend";

MapLegend.propTypes = {
  hasMarkerSizeLegend: PropTypes.bool.isRequired,
  hasRegionColourLegend: PropTypes.bool.isRequired,
  markers: PropTypes.array.isRequired,
  markerSizeLegendItems: PropTypes.array,
  maxScaledMarkerSize: PropTypes.number.isRequired,
  onSelectRows: PropTypes.func.isRequired,
  regionColourLegendItems: PropTypes.array,
  scaleMarkersDataField: DataColumn,
};

export default MapLegend;
