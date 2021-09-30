import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import React from "react";
import Select from "@material-ui/core/Select";

import "../css/colour-palette-list.css";
import { colourSteps, colourRanges } from "../utils/colour-palettes";
import ColourPalette from "./ColourPalette.react";

function calculateDefaultNumberOfSteps(numberOfUniqueValues) {
  if (numberOfUniqueValues >= 24) {
    return 24;
  }
  else {
    for (const step of colourSteps) {
      if (step >= numberOfUniqueValues) {
        return step;
      }
    }

    return 24;
  }
}

class ColourPaletteList extends React.PureComponent {

  state = {
    paletteType: "all",
    numberOfSteps: calculateDefaultNumberOfSteps(this.props.numberOfUniqueValues),
  }

  elementRef = React.createRef()

  getItems() {
    const items = this.props.colourPalettes.filter(
      (x) => {
        return (
          (
            this.state.paletteType === "all"
            ||
            this.state.paletteType === x.type
          )
          &&
          (
            (x.entries.length === this.state.numberOfSteps)
            ||
            (this.state.numberOfSteps === 24 && x.entries.length > 24)
          )
        );
      }
    );
    const groups = {};
    for (const item of items) {
      groups[item.type] = groups[item.type] || [];
      groups[item.type].push(item);
    }

    return Object.entries(groups);
  }

  render() {
    const { props } = this;
    const groups = this.getItems();

    return (
      <div
        className="mr-colour-palette-list"
        ref={this.elementRef}
        style={
          { height: this.state.height }
        }
      >
        { props.children }

        {
          props.hasFilters && (
            <div className="mr-header">
              <FormControl variant="outlined">
                <InputLabel id="colour-palette-type-label">Type</InputLabel>
                <Select
                  labelId="colour-palette-type-label"
                  id="colour-palette-type"
                  onChange={(event) => this.setState({ paletteType: event.target.value })}
                  value={this.state.paletteType}
                  label="Type"
                  IconComponent={() => null}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                  <MenuItem value="diverging">Diverging</MenuItem>
                  <MenuItem value="qualitative">Qualitative</MenuItem>
                  <MenuItem value="sequential">Sequential</MenuItem>
                  <MenuItem value="singlehue">Singlehue</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined">
                <InputLabel id="number-of-steps-label">Steps</InputLabel>
                <Select
                  labelId="number-of-steps-label"
                  onChange={(event) => this.setState({ numberOfSteps: event.target.value })}
                  value={this.state.numberOfSteps}
                  label="Steps"
                  IconComponent={() => null}
                >
                  {
                    colourSteps.map(
                      (x) => (
                        <MenuItem
                          key={x}
                          value={x}
                        >
                          { x }
                        </MenuItem>
                      )
                    )
                  }
                </Select>
              </FormControl>
            </div>
          )
        }

        <div className="mr-list">
          <List subheader={<li />}>
            {
              groups.map(
                ([ group, items ]) => (
                  <li
                    key={group}
                  >
                    <ul>
                      <ListSubheader>{ group }</ListSubheader>
                      {
                        items.map(
                          (item) => (
                            <ListItem
                              key={item.name}
                              onClick={(event) => props.onChange(item.name, event)}
                              title={item.label}
                              selected={item.name === props.value}
                            >
                              <ColourPalette
                                palette={item}
                              />
                            </ListItem>
                          )
                        )
                      }
                    </ul>
                  </li>
                )
              )
            }
          </List>
        </div>
      </div>
    );

  }

}

ColourPaletteList.displayName = "ColourPaletteList";

ColourPaletteList.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  colourPalettes: PropTypes.array,
  hasFilters: PropTypes.bool,
  numberOfUniqueValues: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

ColourPaletteList.defaultProps = {
  colourPalettes: colourRanges,
  hasFilters: true,
  numberOfUniqueValues: 2,
};

export default ColourPaletteList;
