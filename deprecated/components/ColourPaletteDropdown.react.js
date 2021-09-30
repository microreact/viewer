/* eslint-disable class-methods-use-this */
import Autocomplete from "@material-ui/lab/Autocomplete";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import React from "react";
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";

import UiControlsMenu from "./UiControlsMenu.react";

const PaperComponent = React.memo((props) => {
  return (
    <Paper
      {...props}
    >
      <header
        onClick={
          (event) => {
            event.stopPropagation();
          }
        }
      >

      </header>
      { props.children }
    </Paper>
  );
});

PaperComponent.displayName = "PaperComponent";

PaperComponent.propTypes = {
  children: PropTypes.node,
};

const ColourPalettes = React.memo((props) => {
  return (
    <Autocomplete
      // open
      style={{ width: "100%" }}
      options={props.colourPalettes}
      autoHighlight
      disableCloseOnSelect
      getOptionLabel={
        (option) => option.label
      }
      // getOptionSelected={
      //   (option, value) => (option.name === value)
      // }
      groupBy={(option) => option.type}
      onChange={props.onChange}
      renderOption={(option) => {
        if (option.type === "custom") {
          return (<span>{ option.label }</span>);
        }
        else {
          return (
            <div
              className="microreact-colour-palette"
              title={option.label}
            >
              {
                option.colours.map(
                  (backgroundColor) => (
                    <span
                      key={backgroundColor}
                      style={{ backgroundColor }}
                    />
                  )
                )
              }
            </div>
          );
        }
      }}
      size="small"
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          variant="outlined"
          fullWidth
          inputProps={{
            ...params.inputProps,
            autoComplete: "disabled", // disable autocomplete and autofill
          }}
        />
      )}
      PaperComponent={PaperComponent}
      value={props.value ? props.colourPalettes.find((x) => x.name === props.value) : null}
    />
  );
});

ColourPalettes.displayName = "ColourPalettes";

ColourPalettes.propTypes = {
  colourPalettes: PropTypes.array,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
};

// export default ColourPalettes;

export default class extends React.PureComponent {

  static displayName = "ColourPalettes"

  static propTypes = {
    className: PropTypes.string,
    colourPalettes: PropTypes.array,
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any,
  }

  static defaultProps = {}

  state = {
    isExapended: false,
    numberOfSteps: 3,
  }

  getItems() {
    const allItems = this.props.colourPalettes.filter((x) => {
      return (x.colours || x.entries).length === this.state.numberOfSteps;
    });
    const groups = {};
    for (const item of allItems) {
      groups[item.type] = groups[item.type] || [];
      groups[item.type].push(item);
    }

    return Object.entries(groups);
  }

  renderItem(option) {
    if (option.type === "custom") {
      return (<span>{ option.label }</span>);
    }
    else {
      return (
        <div
          className="microreact-colour-palette"
          title={option.label}
        >
          {
            option.colours.map(
              (backgroundColor) => (
                <span
                  key={backgroundColor}
                  style={{ backgroundColor }}
                />
              )
            )
          }
        </div>
      );
    }
  }

  render() {
    const { props } = this;
    const groups = this.getItems();
    const selectedItem = props.value ? props.colourPalettes.find((x) => x.name === props.value) : null;

    if (this.state.isExapended) {
      return (
        <UiControlsMenu
          className="mr-map-markers-menu"
          title="Markers"
        >
          Number of steps
          <Slider
            value={this.state.numberOfSteps}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={3}
            max={110}
            onChange={
              (event, value) => this.setState({ numberOfSteps: value })
            }
          />
          <hr />
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
                            >
                              {
                                this.renderItem(item)
                              }
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
        </UiControlsMenu>
      );
    }
    else {
      return (
        <div className="mr-colour-palette-picker mr-expandable">
          <label>Colour palette</label>
          { selectedItem.label }
        </div>
      );
    }
  }

}
