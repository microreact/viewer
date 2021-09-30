/* eslint-disable react/display-name */
import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { FixedSizeList } from "react-window";

import { AutoSizer } from "react-virtualized";

import "../css/ui-list.css";

const UiList = React.memo(
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
        <AutoSizer>
          {
            ({ width, height }) => (
              <FixedSizeList
                height={height}
                width={width}
                itemSize={28}
                itemCount={props.items.length}
                className={"MuiList-root MuiList-dense"}
              >
                {
                  (args) => props.children(props.items[args.index], args)
                }
              </FixedSizeList>
            )
          }
        </AutoSizer>
      </div>
    );
  },
);

UiList.displayName = "UiList";

UiList.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array,
  children: PropTypes.func,
};

UiList.defaultProps = {
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

export default UiList;
