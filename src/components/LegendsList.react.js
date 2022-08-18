import ListSubheader from "@mui/material/ListSubheader";
import PropTypes from "prop-types";
import React from "react";

import ShapesLegend from "../containers/ShapesLegend.react";
import ColoursLegend from "../containers/ColoursLegend.react";

class LegendsList extends React.PureComponent {

  render() {
    const { props } = this;

    return (
      props.legends.map(
        (item) => {
          if (item.type === "colours") {
            return (
              <div key={item.id}>
                <ListSubheader component="div">
                  { item.title }
                </ListSubheader>
                <ColoursLegend
                  id={item.id}
                  field={item.field}
                />
              </div>
            );
          }
          else if (item.type === "shapes") {
            return (
              <div key={item.id}>
                <ListSubheader component="div">
                  { item.title }
                </ListSubheader>
                <ShapesLegend
                  id={item.id}
                  field={item.field}
                />
              </div>
            );
          }
          else {
            return null;
          }
        }
      )
    );
  }

}

LegendsList.displayName = "LegendsList";

LegendsList.propTypes = {
  legends: PropTypes.array.isRequired,
};

export default LegendsList;
