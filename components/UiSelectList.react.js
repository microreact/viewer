import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import DoneRoundedIcon from "@material-ui/icons/DoneRounded";

import "../css/ui-select-list.css";
import UiToggleSwitch from "./UiToggleSwitch.react";
import UiList from "./UiList.react";
import EmptyIcon from "./EmptyIcon.react";
import { emptyArray } from "../constants";

function toggleSelection(selection, toggledValues, appendOnlyMode) {
  const newSelection = [];

  for (const value of selection) {
    if (!toggledValues.includes(value) || appendOnlyMode) {
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

class UiSelectList extends React.PureComponent {

  renderItem = (item, args) => {
    const { props } = this;
    return (
      <ListItem
        button
        dense
        disableGutters
        key={item.name}
        onClick={
          () => props.onChange(
            toggleSelection(
              props.value,
              [ item.name ],
            ),
          )
        }
        role={undefined}
        style={args.style}
      >
        <ListItemIcon>
          <Checkbox
            checked={props.value.indexOf(item.name) !== -1}
            checkedIcon={props.boxed ? undefined : <DoneRoundedIcon />}
            color="primary"
            disableRipple
            edge="start"
            icon={props.boxed ? undefined : <EmptyIcon />}
            tabIndex={-1}
          />
        </ListItemIcon>
        <ListItemText
          disableTypography
          primary={item.label}
          title={item.label}
        />
        {
          props.showSelectOnly && (
            <Button
              className="mr-select-only"
              color="primary"
              size="small"
              onClick={
                (event) => {
                  event.stopPropagation();
                  props.onChange(
                    toggleSelection(
                      emptyArray,
                      [ item.name ],
                    )
                  );
                }
              }
            >
              Only
            </Button>
          )
        }
      </ListItem>
    );
  }

  renderGroup = (groupName, args, groupItems) => {
    const { props } = this;
    return (
      <ListSubheader
        key={args.index}
        onClick={
          () => props.onChange(
            toggleSelection(
              props.value,
              groupItems.map((x) => x.name),
              !groupItems.every((x) => props.value.includes(x.name)),
            ),
          )
        }
        style={args.style}
        title="Click to toggle group"
      >
        <div className="MuiListItemText-root">
          { props.groupPrefix }{ groupName }
        </div>
        {
          props.showSelectOnly && (
            <Button
              className="mr-select-only"
              color="primary"
              onClick={
                (event) => {
                  event.stopPropagation();
                  props.onChange(
                    toggleSelection(
                      emptyArray,
                      groupItems.map((x) => x.name),
                    )
                  );
                }
              }
              size="small"
              title="Click to only select all items in this group"
            >
              Only
            </Button>
          )
        }
      </ListSubheader>
    );
  }

  render() {
    const { props } = this;

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
            height: 40 + (props.items.length * 28),
            maxHeight: props.maxHeight,
          }
        }
      >
        {
          (!props.disableSelectAll && props.items.length > 0) && (
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
          groupItem={props.groupItem}
          items={props.items}
          renderGroup={this.renderGroup}
          renderItem={this.renderItem}
          value={props.value}
        />
      </div>
    );
  }

}

UiSelectList.displayName = "UiSelectList";

UiSelectList.propTypes = {
  boxed: PropTypes.bool,
  className: PropTypes.string,
  disableSelectAll: PropTypes.bool,
  groupItem: PropTypes.func,
  groupPrefix: PropTypes.node,
  items: PropTypes.array,
  maxHeight: PropTypes.string,
  onChange: PropTypes.func,
  selectAllLabel: PropTypes.string,
  showSelectOnly: PropTypes.bool,
  style: PropTypes.object,
  title: PropTypes.string,
  value: PropTypes.array,
};

UiSelectList.defaultProps = {
  boxed: true,
  disableSelectAll: false,
  maxHeight: "calc(100vh - 200px)",
  value: emptyArray,
};

export default UiSelectList;
