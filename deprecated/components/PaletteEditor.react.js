/* eslint-disable class-methods-use-this */

import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import BaseTable from "react-base-table/lib";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import React from "react";
import TextField from "@material-ui/core/TextField";

import "../css/palette-editor.css";

import UiSelect from "./UiSelect.react";
import UiDialog from "./UiDialog.react";
import UiTextfield from "./UiTextfield.react";
import ColourPicker from "./ColourPicker.react";
import { generateHashId } from "../utils/hash";
import { StylePalette } from "../utils/prop-types";
import { fullSizeStyle, halfWidthWithPaddingStyle } from "../constants";

class PaletteEditor extends React.PureComponent {

  state = {};

  tableRef = React.createRef()

  columns = [
    {
      dataKey: "actions",
      key: "actions",
      name: "actions",
      title: "",
      width: 40,
      className: "mr-actions-cell",
      cellRenderer: ({ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }) => {
        return (
          <IconButton
            size="small"
            onClick={() => this.removeEntry(rowData)}
          >
            <DeleteTwoToneIcon />
          </IconButton>
        );
      },
    },
    {
      dataKey: "value",
      key: "value",
      name: "value",
      minWidth: 120,
      title: "Value",
      width: 240,
      className: "mr-value-cell",
      cellRenderer: ({ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }) => {
        return (
          <TextField
            fullWidth
            margin="dense"
            size="small"
            variant="outlined"
            value={cellData}
            onChange={(event) => this.updateEntry(rowData, { value: event.target.value })}
          />
        );
      },
    },
    {
      dataKey: "colour",
      key: "colour",
      name: "colour",
      minWidth: 120,
      title: "Colour",
      width: 240,
      cellRenderer: ({ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }) => {
        return (
          <ColourPicker
            value={cellData ?? "white"}
            onChange={(colour) => this.updateEntry(rowData, { colour })}
          />
        );
      },
    },
  ]

  componentDidMount() {
    const { props } = this;

    if (props.mode === "edit") {
      this.setState({
        range: props.colourPalette.range,
        bins: props.colourPalette.bins,
        label: props.colourPalette.label,
        rows: props.colourPalette.entries.map(
          (x) => {
            return {
              id: generateHashId(),
              value: x[0],
              colour: x[1],
            };
          }
        ),
      });
    }
    // this.setState({
    //   label: (props.colourPalette.type === "custom") ? props.colourPalette.label : `Custom palette based on ${props.colourPalette.label}`,
    //   rows: Object.entries(this.props.valueToColourMap).map(
    //     ([ value, colour]) => ({
    //       id: generateHashId(),
    //       value,
    //       colour,
    //     })
    //   ),
    //   // rows: props.colourPalette.entries.map(
    //   //   (x) => {
    //   //     if (Array.isArray(x)) {
    //   //       return {
    //   //         id: generateHashId(),
    //   //         value: x[0],
    //   //         colour: x[1],
    //   //       };
    //   //     }
    //   //     else {
    //   //       return {
    //   //         id: generateHashId(),
    //   //         value: "",
    //   //         colour: x,
    //   //       };
    //   //     }
    //   //   }
    //   // ),
    // });
  }

  addNewEntry = () => {
    const rows = [ ...this.state.rows ];

    rows.push({
      id: generateHashId(),
      value: "",
      colour: "white",
    });

    this.setState(
      { rows },
      () => {
        this.tableRef.current.scrollToRow(rows.length - 1);
      },
    );
  }

  updateEntry = (row, update) => {
    const rows = [ ...this.state.rows ];

    const index = rows.findIndex((x) => x.id === row.id);

    rows[index] = {
      ...rows[index],
      ...row,
      ...update,
    };

    this.setState({ rows });
  }

  removeEntry = (row) => {
    const rows = [ ...this.state.rows ];

    const index = rows.findIndex((x) => x.id === row.id);

    rows.splice(index, 1);

    this.setState({ rows });
  }

  handleSave = () => {
    const { props, state } = this;

    const entries = [];

    for (const row of state.rows) {
      entries.push([ row.value, row.colour ]);
    }

    if (props.mode === "edit") {
      props.onUpdatePalette({
        name: props.colourPalette.name,
        label: state.label,
        entries,
      });
    }
    else {
      props.onAddPalette({
        name: props.palette.name,
        label: state.label,
        entries,
      });
    }

    props.onClose();
  }

  renderActions = () => {
    return (
      <React.Fragment>
        <Button
          startIcon={<AddCircleOutlineRoundedIcon />}
          onClick={this.addNewEntry}
        >
          Add New Entry
        </Button>
        <hr />
        <Button
          onClick={this.handleSave}
          color="primary"
          variant="contained"
          disableElevation
        >
          Save
        </Button>
      </React.Fragment>
    );
  }

  renderTitle = () => {
    return (
      <React.Fragment>
        Colour Palette Editor
      </React.Fragment>
    );
  }

  render() {
    const { props, state } = this;

    return (
      <UiDialog
        actions={this.renderActions()}
        className="mr-palette-editor"
        isOpen
        onClose={props.onClose}
        title={this.renderTitle()}
      >
        <Box
          display="flex"
          flexDirection="column"
          style={fullSizeStyle}
        >
          <Box className="mr-header">
            <TextField
              label="Palette Name"
              fullWidth
              margin="dense"
              size="small"
              variant="outlined"
              value={this.state.label}
              onChange={(event) => this.setState({ label: event.target.value })}
            />

            <Box
              display="flex"
              justifyContent="space-between"
              style={
                { marginTop: "8px" }
              }
            >
              <Box style={(state.range === "sequential") ? halfWidthWithPaddingStyle : fullSizeStyle}>
                <UiSelect
                  label="Included Values"
                  variant="outlined"
                  size="small"
                  value={state.range ?? "discrete"}
                  onChange={(range) => this.setState({ range })}
                  options={
                    [
                      {
                        label: "Discrete",
                        value: "discrete",
                      },
                      {
                        label: "Continuous",
                        value: "continuous",
                      },
                      {
                        label: "Sequential",
                        value: "sequential",
                      },
                    ]
                  }
                  style={fullSizeStyle}
                />
              </Box>
              {
                (state.range === "sequential") && (
                  <Box style={halfWidthWithPaddingStyle}>
                    <UiTextfield
                      autoFocus
                      disableClear
                      fullWidth
                      label="Number of steps"
                      onChange={(value) => this.setState({ bins: Math.max(2, parseInt(value, 10)) })}
                      style={fullSizeStyle}
                      type="number"
                      value={state.bins ?? 2}
                      variant="outlined"
                    />
                  </Box>
                )
              }
            </Box>

          </Box>

          <Box flexGrow="1">
            <AutoSizer>
              {
                ({ height, width }) => (
                  <BaseTable
                    className="mr-mini-table"
                    columns={this.columns}
                    data={state.rows}
                    fixed
                    height={height}
                    ref={this.tableRef}
                    rowHeight={32}
                    rowKey={"id"}
                    width={width}
                  />
                )
              }
            </AutoSizer>
          </Box>
        </Box>
      </UiDialog>
    );
  }

}

PaletteEditor.propTypes = {
  onAddPalette: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  onUpdatePalette: PropTypes.func.isRequired,
  mode: PropTypes.oneOf([ "edit", "create" ]),
  colourPalette: StylePalette,
};

PaletteEditor.displayName = "PaletteEditor";

export default PaletteEditor;
