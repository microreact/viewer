import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";

// import "../styles/ui-select-list.css";
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
        key={item[props.valueProperty]}
        onClick={
          () => props.onChange(
            toggleSelection(
              props.value,
              [ item[props.valueProperty] ],
            ),
          )
        }
        role={undefined}
        style={args.style}
      >
        <ListItemIcon>
          <Checkbox
            checked={props.value.indexOf(item[props.valueProperty]) !== -1}
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
          // style={item.style}
          // secondary={props.renderItemContent?.(item, args)}
        />
        {
          props.renderItemContent?.(item, args)
        }
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
                      [ item[props.valueProperty] ],
                    )
                  );
                }
              }
              size="small"
              title="Click to only select this item"
            >
              Only
            </Button>
          )
        }
      </ListItem>
    );
  };

  renderGroup = (groupName, args, groupItems) => {
    const { props } = this;
    return (
      <ListSubheader
        key={args.index}
        onClick={
          () => props.onChange(
            toggleSelection(
              props.value,
              groupItems.map((x) => x[props.valueProperty]),
              !groupItems.every((x) => props.value.includes(x[props.valueProperty])),
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
                      groupItems.map((x) => x[props.valueProperty]),
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
  };

  render() {
    const { props } = this;

    const allSelected = (
      props.items.length
      &&
      props.items.every((x) => props.value.includes(x[props.valueProperty]))
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
                    allSelected ? props.items.map((x) => x[props.valueProperty]) : props.items.map((x) => x[props.valueProperty]).filter(((x) => !props.value.includes(x))),
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
  labelProperty: PropTypes.string,
  maxHeight: PropTypes.string,
  onChange: PropTypes.func,
  renderItemContent: PropTypes.func,
  selectAllLabel: PropTypes.string,
  showSelectOnly: PropTypes.bool,
  style: PropTypes.object,
  title: PropTypes.string,
  value: PropTypes.array,
  valueProperty: PropTypes.string,
};

UiSelectList.defaultProps = {
  boxed: true,
  disableSelectAll: false,
  labelProperty: "label",
  maxHeight: "calc(100vh - 200px)",
  value: emptyArray,
  valueProperty: "name",
};

export default UiSelectList;
