/* eslint-disable class-methods-use-this */

import BaseTable from "react-base-table/lib";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import React from "react";

import "../css/custom-colour-palette-editor.css";

import { fullSizeStyle } from "../constants";
import { generateHashId } from "../utils/hash";
import { StylePalette } from "../utils/prop-types";

import ColourPicker from "./ColourPicker.react";
import { nextTick } from "../utils/browser";

class CustomColourPaletteEditor extends React.PureComponent {

  state = {};

  tableRef = React.createRef()

  baseTableCols = [
    {
      dataKey: "value",
      key: "value",
      name: "value",
      title: "Value",
      width: 160,
      className: "mr-value-cell",
      cellRenderer: ({ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }) => {
        if (this.isNumeric()) {
          return (rowIndex === 0) ? "Start colour" : "End colour";
        }
        else {
          return cellData?.toString();
        }
      },
    },
    {
      dataKey: "colour",
      key: "colour",
      name: "colour",
      title: "Colour",
      width: 184,
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

  isNumeric = () => this.props.bins >= 0

  componentDidMount() {
    const { props } = this;

    const rows = [];
    if (props.colourPalette.type === "custom") {
      for (const x of props.colourPalette.entries) {
        rows.push({
          id: generateHashId(),
          value: x[0],
          colour: x[1],
        });
      }
    }
    else if (this.isNumeric()) {
      rows.push({
        id: 0,
        colour: props.colourPalette.entries[0],
      });
      rows.push({
        id: 1,
        colour: props.colourPalette.entries[props.colourPalette.entries.length - 1],
      });
    }
    else {
      for (const [ value, colour ] of props.colourMap.entries()) {
        rows.push({
          id: generateHashId(),
          value,
          colour,
        });
      }
    }

    this.setState({
      rows,
      // initialRows: rows,
    });
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

  handleSave = () => {
    const { props, state } = this;

    const entries = [];

    for (const row of state.rows) {
      entries.push([ row.value, row.colour ]);
    }

    if (props.colourPalette.type === "custom") {
      props.onUpdatePalette({
        bins: props.bins,
        entries,
        name: props.colourPalette.name,
      });
    }
    else {
      const palette = {
        bins: props.bins,
        entries,
        label: props.field ? `Custom Palettle for ${props.field}` : undefined,
        name: `palette-${generateHashId()}`,
      };
      props.onAddPalette(
        palette,
        // props.field,
      );
      if (props.onCustomPaletteCreated) {
        nextTick(() => props.onCustomPaletteCreated(palette));
      }
    }

    props.onClose && props.onClose();
  }

  renderActions = () => {
    return (
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        style={fullSizeStyle}
      >
        {/*
        {
          this.props.onClose && (
            <Button
              onClick={this.props.onClose}
              variant="outlined"
              size="small"
              disableElevation
            >
              Cancel
            </Button>
          )
        }
        &nbsp;
        */}
        <Button
          onClick={this.handleSave}
          variant="outlined"
          size="small"
          disableElevation
        >
          Confirm
        </Button>
      </Box>
    );
  }

  render() {
    const { state } = this;

    return (
      <div
        className="mr-custom-colour-palette-editor"
      >
        <BaseTable
          columns={this.baseTableCols}
          data={state.rows}
          fixed
          headerHeight={0}
          height={this.isNumeric() ? 104 : 264}
          ref={this.tableRef}
          rowHeight={32}
          rowKey={"id"}
          width={368 - 2}
          footerHeight={40}
          footerRenderer={this.renderActions}
        />
      </div>
    );
  }

}

CustomColourPaletteEditor.propTypes = {
  colourMap: PropTypes.instanceOf(Map),
  colourPalette: StylePalette,
  field: PropTypes.string,
  mode: PropTypes.oneOf([ "edit", "create" ]),
  onAddPalette: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  onUpdatePalette: PropTypes.func.isRequired,
  bins: PropTypes.number,
};

CustomColourPaletteEditor.displayName = "CustomColourPaletteEditor";

export default CustomColourPaletteEditor;
