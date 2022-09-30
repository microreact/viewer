import PropTypes from "prop-types";
import React from "react";

// import "../styles/legend-pane.css";

import LinearGradientSvgImage from "./LinearGradientSvgImage.react";

class ColoursLegend extends React.PureComponent {

  render() {
    const { props } = this;

    if (props.scale === "discrete" || props.scale === "binned") {
      return (
        <div
          className="mr-legend-entries"
          id={props.id}
        >
          {
            props.entries.map(
              (item, index) => {
                return (
                  <button
                    key={index}
                    onClick={
                      props.onSelectQueryRows
                        ?
                        (e) => props.onSelectQueryRows(
                          item.value,
                          e.metaKey || e.ctrlKey,
                        )
                        :
                        undefined
                    }
                    className={item.isSelected ? "mr-selected" : null}
                  >
                    <code
                      style={
                        { backgroundColor: item.colour }
                      }
                    />
                    { item.label }
                  </button>
                );
              }
            )
          }
        </div>
      );
    }

    if (props.scale === "continuous") {
      return (
        <div
          className="mr-legend-entries"
          id={props.id}
        >
          <table
            className="mr-legend-table"
            border="0"
          >
            <tbody>
              <tr>
                <td
                  style={
                    {
                      paddingLeft: "6px",
                      minWidth: "16px",
                    }
                  }
                  rowSpan="3"
                >
                  <LinearGradientSvgImage
                    width={16}
                    height={120}
                    startColour={props.entries[0].colour}
                    stopColour={props.entries[1].colour}
                  />
                </td>
                <td
                  style={{ height: "20px", verticalAlign: "top", textAlign: "left" }}
                >
                  &nbsp;{props.entries[0].value}
                </td>
              </tr>
              <tr>
                <td
                  style={{ height: "*" }}
                >
                  &nbsp;
                </td>
              </tr>
              <tr>
                <td
                  style={{ height: "20px", verticalAlign: "bottom", textAlign: "left" }}
                >
                  &nbsp;{props.entries[1].value}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    return null;

  }

}

ColoursLegend.displayName = "ColoursLegend";

ColoursLegend.propTypes = {
  entries: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  onSelectQueryRows: PropTypes.func,
  scale: PropTypes.string.isRequired,
};

export default ColoursLegend;
