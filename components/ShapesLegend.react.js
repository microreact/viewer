import PropTypes from "prop-types";
import React from "react";

import "../css/legend-pane.css";

import ShapeSvgImage from "./ShapeSvgImage.react";

class ShapesLegend extends React.PureComponent {

  render() {
    const { props } = this;

    return (
      <div
        className="mr-legend-entries mr-shapes-legend"
        id={props.id}
      >
        {
          this.props.entries.map(
            (item, index) => {
              return (
                <button
                  key={index}
                  onClick={
                    this.props.onSelectQueryRows
                      ?
                      (e) => this.props.onSelectQueryRows(
                        item.value,
                        e.metaKey || e.ctrlKey,
                      )
                      :
                      undefined
                  }
                  className={item.isSelected ? "mr-selected" : null}
                >
                  <ShapeSvgImage
                    shape={item.shape}
                    colour="transparent"
                  />
                  <span>{ item.label }</span>
                </button>
              );
            }
          )
        }
      </div>
    );
  }

}

ShapesLegend.displayName = "ShapesLegend";

ShapesLegend.propTypes = {
  entries: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  onSelectQueryRows: PropTypes.func,
};

ShapesLegend.defaultProps = {
  shapeSize: 32,
};

export default ShapesLegend;
