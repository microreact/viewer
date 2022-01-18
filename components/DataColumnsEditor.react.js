/* eslint "react/prop-types": 0 */

import React from "react";
import PropTypes from "prop-types";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import BaseTable from "react-base-table/lib";
import DataColumnColourSettingsMenu from "../containers/ColourSettingsMenu.react";

import "../css/data-columns-editor.css";
import { DataColumn } from "../utils/prop-types";
import UiTextfield from "./UiTextfield.react";

export default class DataColumnsEditor extends React.PureComponent {

  state = {
    columnIndex: null,
    rowIndex: null,
    scrollToRow: 0,
  }

  columns = [
    {
      dataKey: "label",
      key: "name",
      name: "name",
      title: "Column",
      width: 300,
      cellRenderer: ({ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }) => {
        return (
          <UiTextfield
            onChange={(value) => this.props.onUpdateColumnLabel(rowData.name, value)}
            size="small"
            value={cellData}
            variant="outlined"
          />
        );
      },
    },
    {
      dataKey: "dataType",
      key: "dataType",
      name: "dataType",
      title: "Data Type",
      width: 96,
      // cellRenderer: ({ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }) => {
      //   return (
      //     <UiTextfield
      //       disabled
      //       variant="outlined"
      //       size="small"
      //       value={cellData}
      //     />
      //   );
      // },
    },
    {
      className: "mr-colour-settings",
      dataKey: "colours",
      key: "colours",
      name: "colours",
      title: "Colours",
      width: 160,
      cellRenderer: ({ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }) => {
        return (
          <DataColumnColourSettingsMenu field={rowData.name} />
        );
      },
    },
    {
      className: "",
      dataKey: "shapes",
      key: "shapes",
      name: "shapes",
      title: "Shapes",
      width: 160,
      cellRenderer: ({ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }) => {
        return (
          null
        );
      },
    },
  ]

  render() {
    const { props } = this;

    return (
      <AutoSizer>
        {
          ({ height, width }) => (
            <BaseTable
              fixed
              className="mr-data-columns-editor"
              columns={this.columns}
              data={props.dataColumns.filter((x) => !x.name.startsWith("--mr-"))}
              rowKey={"name"}
              width={width}
              height={Math.max(200, height - 4)}
              rowHeight={42}
            />
          )
        }
      </AutoSizer>
    );
  }

}

DataColumnsEditor.displayName = "DataColumnsEditor";

DataColumnsEditor.propTypes = {
  dataColumns: PropTypes.arrayOf(DataColumn).isRequired,
  onHeaderClick: PropTypes.func,
};
