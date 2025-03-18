import PropTypes from "prop-types";
import React from "react";

function toNumber(value) {
  if (value?.toFixed) {
    return parseFloat(value.toFixed(4));
  }
  return value;
}

function renderGradient(regionColourLegendItems) {
  return (
    <React.Fragment>
      <tr>
        <td
          style={
            {
              background: `linear-gradient(${regionColourLegendItems[0]?.colour}, ${regionColourLegendItems[regionColourLegendItems.length - 1]?.colour})`,
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
          &nbsp;{toNumber(regionColourLegendItems[0]?.value)}
        </td>
      </tr>
      <tr>
        <td
          style={{ verticalAlign: "bottom", textAlign: "left" }}
        >
          &nbsp;{toNumber(regionColourLegendItems[regionColourLegendItems.length - 1]?.value)}
        </td>
      </tr>
    </React.Fragment>
  );
}

function renderStep(stepIndex, step, allSteps) {
  if (allSteps.length === 1) {
    return (
      <td style={{ textAlign: "left" }}>
        {toNumber(step.value)}
      </td>
    );
  }
  if (stepIndex === 0) {
    return (
      <td style={{ textAlign: "left" }}>
        &nbsp;≤{toNumber(step.value)}
      </td>
    );
  }
  if (stepIndex === allSteps.length - 1) {
    return (
      <td style={{ textAlign: "left" }}>
        &nbsp;≥{toNumber(step.value)}
      </td>
    );
  }
  return (
    <td style={{ textAlign: "left" }}>
      &nbsp;{toNumber(allSteps[stepIndex - 1].value)} - {toNumber(step.value)}
    </td>
  );
}

function renderBins(regionColourLegendItems) {
  return (
    <React.Fragment>
      {
        regionColourLegendItems.map(
          (item, index) => (
            <tr key={item.value}>
              <td
                style={
                  {
                    background: `${item.colour}`,
                    minWidth: "8px",
                  }
                }
              >
                &nbsp;
              </td>
              {
                renderStep(index, item, regionColourLegendItems)
              }
            </tr>
          )
        )
      }
    </React.Fragment>
  );
}

function MapColourLegend(props) {

  return (
    <table
      role="presentation"
      className="mr-legend-table"
    >
      <thead style={{ height: "16px" }}>
        <tr>
          <td
            colSpan="2"
            title="Region Colour"
          >
            # entries
          </td>
        </tr>
      </thead>
      <tbody style={{ height: "calc(100% - 16px)" }}>
        {
          props.regionsColourScale === "binned"
            ?
            renderBins(props.colourLegendEntries)
            :
            renderGradient(props.colourLegendEntries)
        }
      </tbody>
    </table>
  );
}

MapColourLegend.displayName = "MapLegend";

MapColourLegend.propTypes = {
  regionsColourScale: PropTypes.string.isRequired,
  colourLegendEntries: PropTypes.array.isRequired,
};

export default MapColourLegend;
