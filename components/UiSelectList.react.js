import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import DoneRoundedIcon from "@material-ui/icons/DoneRounded";

import "../css/ui-select-list.css";
import UiToggleSwitch from "./UiToggleSwitch.react";
import UiList from "./UiList.react";
import EmptyIcon from "./EmptyIcon.react";
import { emptyArray } from "../constants";

function toggleSelection(selection, toggledValues) {
  const newSelection = [];

  for (const value of selection) {
    if (!toggledValues.includes(value)) {
      newSelection.push(value);
    }
  }

  for (const value of toggledValues) {
    if (!selection.includes(value)) {
      newSelection.push(value);
    }
  }

  return newSelection;
}

const UiSelectList = React.memo(
  (props) => {
    const allSelected = (
      props.items.length
      &&
      props.items.every((x) => props.value.includes(x.name))
    );

    return (
      <div
        className={
          classnames(
            "mr-ui-select-list",
            props.className,
          )
        }
        title={props.title}
        style={
          props.style
          ??
          {
            height: (props.selectAll ? 40 : 0) + (props.items.length * 28),
            maxHeight: props.maxHeight,
          }
        }
      >
        {
          props.selectAll && (props.items.length > 0) && (
            <UiToggleSwitch
              className="mr-select-all"
              label={props.selectAllLabel || "Select all"}
              onChange={
                () => props.onChange(
                  toggleSelection(
                    props.value,
                    allSelected ? props.items.map((x) => x.name) : props.items.map((x) => x.name).filter(((x) => !props.value.includes(x))),
                  )
                )
              }
              value={allSelected}
              // labelPlacement={"end"}
            />
          )
        }
        <UiList
          items={props.items}
        >
          {
            (item, { index, style }) => (
              <ListItem
                key={item.name}
                role={undefined}
                button
                onClick={() => props.onChange(toggleSelection(props.value, [ item.name ]))}
                style={style}
                disableGutters
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    checked={props.value.indexOf(item.name) !== -1}
                    color="primary"
                    disableRipple
                    edge="start"
                    tabIndex={-1}
                    icon={props.boxed ? undefined : <EmptyIcon />}
                    checkedIcon={props.boxed ? undefined : <DoneRoundedIcon />}
                  />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={item.label}
                  title={item.label}
                />
                {
                  props.selectOnly && (
                    <Button
                      className="mr-select-only"
                      color="primary"
                      size="small"
                      onClick={
                        (event) => {
                          event.stopPropagation();
                          props.onChange(toggleSelection(emptyArray, [ item.name ]));
                        }
                      }
                    >
                      Only
                    </Button>
                  )
                }
              </ListItem>
            )
          }
        </UiList>
      </div>
    );
  },
);

UiSelectList.displayName = "UiSelectList";

UiSelectList.propTypes = {
  boxed: PropTypes.bool,
  className: PropTypes.string,
  items: PropTypes.array,
  maxHeight: PropTypes.string,
  onChange: PropTypes.func,
  selectAll: PropTypes.bool,
  selectAllLabel: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string,
  value: PropTypes.array,
};

UiSelectList.defaultProps = {
  boxed: true,
  value: emptyArray,
  maxHeight: "calc(100vh - 200px)",
};

export default UiSelectList;
