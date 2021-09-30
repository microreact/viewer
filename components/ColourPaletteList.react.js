import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import PropTypes from "prop-types";
import React from "react";

import "../css/colour-palette-list.css";

import ColourPalette from "./ColourPalette.react";
import { StylePalette } from "../utils/prop-types";

class ColourPaletteList extends React.PureComponent {

  getItems() {
    const groups = {};
    for (const item of this.props.items) {
      groups[item.type] = groups[item.type] || [];
      groups[item.type].push(item);
    }

    return Object.entries(groups);
  }

  render() {
    const { props } = this;
    const groups = this.getItems();

    return (
      <div className="mr-colour-palette-list">
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
                              onClick={(event) => props.onChange(item, event)}
                              title={item.label}
                              selected={item.name === props.value?.name}
                            >
                              <ColourPalette
                                palette={item}
                                bins={props.bins}
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
  bins: PropTypes.number,
  items: PropTypes.arrayOf(StylePalette).isRequired,
  onChange: PropTypes.func.isRequired,
  value: StylePalette,
};

export default ColourPaletteList;
