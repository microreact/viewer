/* eslint-disable react/display-name */
import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import { FixedSizeList } from "react-window";

import AutoSizer from "react-virtualized-auto-sizer";

// import "../styles/ui-list.css";

const UiGroupedList = React.memo(
  (props) => {
    return (
      <div
        className={
          classnames(
            "mr-ui-list",
            props.className,
          )
        }
        style={
          {
            height: "100%",
            width: "100%",
            // height: props.items.length * 28,
            // maxHeight: "100vh",
          }
        }
      >
        <List
          height={height}
          width={width}
          itemSize={28}
          itemCount={props.items.length}
          className={"MuiList-root MuiList-dense"}
        >
          {
            (args) => props.children(props.items[args.index], args)
          }
        </List>
      </div>
    );
  },
);

UiGroupedList.displayName = "UiGroupedList";

UiGroupedList.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array,
  children: PropTypes.func,
};

UiGroupedList.defaultProps = {
  children: (item, { index, style }) => (
    <ListItem
      button
      style={style}
      key={index}
    >
      <ListItemText primary={item} />
    </ListItem>
  ),
};

export default UiGroupedList;
