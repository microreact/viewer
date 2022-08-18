/* eslint-disable semi-spacing */
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Button from "@material-ui/core/Button";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import React from "react";
import Select from "@material-ui/core/Select";
import ColorizeRoundedIcon from '@material-ui/icons/ColorizeRounded';
import InputLabel from '@material-ui/core/InputLabel';

import FormControl from '@material-ui/core/FormControl';

import "../css/colour-field-palette-picker.css";
import { colourSteps } from "../utils/colour-palettes";
import { DataField, StylePalette } from "../utils/prop-types";

import ColourPalette from "./ColourPalette.react";
import PaletteEditor from "../containers/PaletteEditor.react";

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

class ColourFieldPalettePicker extends React.PureComponent {

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     isExapended: false,
  //     numberOfSteps: 3,
  //   };
  // }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (nextProps.numberOfSteps !== prevState.numberOfSteps) {
  //     return { numberOfSteps: nextProps.numberOfSteps };
  //   }
  //   else {
  //     return null;
  //   }
  // }

  state = {
    showEditor: false,
    isExapended: false,
    paletteType: "all",
    numberOfSteps: calculateDefaultNumberOfSteps(this.props.valueToColourMap.size),
  }

  elementRef = React.createRef()

  paletteEditorRef = React.createRef()

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
            ||
            x.type === "custom"
          )
        );
      }
    );
    const groups = {};
    for (const item of items) {
      // const type = (item.type === "custom") ? item.label : item.type;
      groups[item.type] = groups[item.type] || [];
      groups[item.type].push(item);
    }

    return Object.entries(groups);
  }

  toggleExpanded = () => {
    const rect = this.elementRef.current.getBoundingClientRect();
    const height = (
      window.innerHeight
        - rect.y
        - 4 // borders
        - 32 // margins
        - 64 // default colour
        - 54 // tab headers
        // - 48 // shapes header
        // - 48 // legend header
    );
    this.setState({
      isExapended: !this.state.isExapended,
      height,
    });
  }

  handleOpenEditor = () => {
    this.setState({ showEditor: true });
  }

  handleCloseEditor = () => {
    this.setState({ showEditor: false });
  }

  render() {
    const { props } = this;
    const groups = this.getItems();
    const selectedPelette = props.colourPalettes.find((x) => x === props.value);

    if (this.state.isExapended) {
      return (
        <div
          className="mr-colour-field-palette-picker mr-expanded"
          ref={this.elementRef}
          style={
            { height: this.state.height }
          }
        >
          <label className="mr-floating-label">Colour palette</label>

          {
            (this.state.showEditor) && (
              <PaletteEditor
                palette={selectedPelette}
                valueToColourMap={props.valueToColourMap}
                onClose={this.handleCloseEditor}
              />
            )
          }

          <IconButton
            edge="start"
            color="inherit"
            onClick={this.toggleExpanded}
            className="mr-toggle-button"
          >
            <ArrowDropDownIcon />
          </IconButton>

          <div className="mr-controls">
            {/* Steps { this.state.numberOfSteps }
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
            /> */}
            <FormControl
              variant="outlined"
            >
              <InputLabel id="colour-palette-type-label">Type</InputLabel>
              <Select
                labelId="colour-palette-type-label"
                onChange={(event) => this.setState({ paletteType: event.target.value })}
                value={this.state.paletteType}
                variant="outlined"
                size="small"
                // inputProps={
                //   { size: "small" }
                // }
                IconComponent={() => null}
                label="Type"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
                <MenuItem value="diverging">Diverging</MenuItem>
                <MenuItem value="qualitative">Qualitative</MenuItem>
                <MenuItem value="sequential">Sequential</MenuItem>
                <MenuItem value="singlehue">Singlehue</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
            >
              <InputLabel id="number-of-steps-label">Steps</InputLabel>
              <Select
                labelId="number-of-steps-label"
                onChange={(event) => this.setState({ numberOfSteps: event.target.value })}
                value={this.state.numberOfSteps}
                variant="outlined"
                size="small"
                IconComponent={() => null}
                label="Steps"
              >
                {
                  colourSteps.map(
                    (x) => (
                      <MenuItem
                        key={x}
                        value={x}
                      >
                        { (x === 24) ? "≥ 24" : x }
                      </MenuItem>
                    )
                  )
                }
              </Select>
            </FormControl>

          </div>

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
                                onClick={(event) => props.onChange(event, item)}
                                title={item.label}
                              >
                                {/* { (item.type === "custom") && (<small>{ item.label }</small>) } */}
                                <small>{ item.label }</small>
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

          <Button
            color="primary"
            disableElevation
            onClick={this.handleOpenEditor}
            size="small"
            startIcon={<ColorizeRoundedIcon />}
            variant="text"
            className="mr-customise-button"
          >
            { (selectedPelette.type === "custom") ? "Edit" : "Customise" }
            &nbsp;
            { selectedPelette.label }
          </Button>

        </div>
      );
    }
    else {
      return (
        <div
          className="mr-colour-field-palette-picker mr-expandable"
          onClick={this.toggleExpanded}
          title="Click to exapnd"
          ref={this.elementRef}
        >
          <label className="mr-floating-label">Colour palette</label>

          <IconButton
            edge="start"
            color="inherit"
            onClick={this.toggleExpanded}
            className="mr-toggle-button"
          >
            <ArrowDropDownIcon />
          </IconButton>

          <span className="mr-value">
            { selectedPelette.label }
          </span>

          <ColourPalette
            palette={selectedPelette}
          />
        </div>
      );
    }
  }

}

ColourFieldPalettePicker.displayName = "ColourFieldPalettePicker";

ColourFieldPalettePicker.propTypes = {
  className: PropTypes.string,
  colourPalettes: PropTypes.arrayOf(StylePalette).isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: StylePalette.isRequired,
  valueToColourMap: PropTypes.object.isRequired,
};

export default ColourFieldPalettePicker;
