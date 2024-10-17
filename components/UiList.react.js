/* eslint-disable react/display-name */
import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { FixedSizeList } from "react-window";
import { createSelector } from "reselect";
import groupby from "lodash.groupby";

import AutoSizer from "react-virtualized-auto-sizer";

// import "../styles/ui-list.css";
import { fullSizeStyle } from "../constants";

class UiList extends React.PureComponent {

  groupsSelector = createSelector(
    (params) => params.items,
    (params) => params.groupItem,
    (
      items,
      groupItem,
    ) => {
      if (items && groupItem) {
        const groups = groupby(items, groupItem);
        return groups;
      }
      else {
        return undefined;
      }
    }
  );

  itemsSelector = createSelector(
    (params) => params.items,
    this.groupsSelector,
    (
      items,
      groups,
    ) => {
      if (items && groups) {
        const itemsWithGroups = [];
        for (const groupName of Object.keys(groups)) {
          if (groupName) {
            itemsWithGroups.push(groupName);
          }
          for (const item of groups[groupName]) {
            itemsWithGroups.push(item);
          }
        }
        return itemsWithGroups;
      }
      else {
        return items;
      }
    }
  );

  renderItem = (args, items, groups) => {
    const { props } = this;
    const item = items[args.index];
    if (typeof item === "string") {
      return props.renderGroup(item, args, groups[item]);
    }
    else {
      return props.renderItem(item, args, items, groups);
    }
  }

  render() {
    const { props } = this;
    const groups = this.groupsSelector(props);
    const items = this.itemsSelector(props);
    return (
      <div
        className={
          classnames(
            "mr-ui-list",
            props.className,
          )
        }
        style={fullSizeStyle}
      >
        <AutoSizer>
          {
            ({ width, height }) => (
              <FixedSizeList
                className={"MuiList-root MuiList-dense"}
                height={height}
                itemCount={items.length}
                itemSize={28}
                width={width}
              >
                { (args) => this.renderItem(args, items, groups) }
              </FixedSizeList>
            )
          }
        </AutoSizer>
      </div>
    );
  }

}

UiList.displayName = "UiList";

UiList.propTypes = {
  className: PropTypes.string,
  groupItem: PropTypes.func,
  items: PropTypes.array,
  renderItem: PropTypes.func,
  renderGroup: PropTypes.func,
};

UiList.defaultProps = {
  renderItem: (item, args) => (
    <ListItem
      button
      style={args.style}
      key={args.index}
    >
      <ListItemText primary={item} />
    </ListItem>
  ),
  renderGroup: (item, args) => (
    <ListSubheader
      button
      style={args.style}
      key={args.index}
    >
      { item }
    </ListSubheader>
  ),
};

export default UiList;
