import PropTypes from "prop-types";
import React from "react";
import Paper from "@material-ui/core/Paper";
import { createSelector } from "reselect";
import Box from "@material-ui/core/Box";

import UiCombobox from "./UiCombobox.react";
import UiTabs from "./UiTabs.react";
import MiniTable from "./MiniTable.react";
import DataColumnsEditor from "./DataColumnsEditor.react";
import FileEditor from "../containers/FileEditor.react";
import { fullSizeStyle } from "../constants";
import { DataColumn } from "../utils/prop-types";

class TablePaneEditor extends React.PureComponent {

  possibleIdFields = createSelector(
    (props) => props.masterDataFile._content,
    ({ rows, columns }) => {
      const idFields = [];

      for (const dataColumn of columns) {
        if (dataColumn.name !== "--mr-index") {
          const values = new Set();
          let isUnique = true;
          for (const row of rows) {
            const value = row[dataColumn.name];
            if (value === undefined || value === null || values.has(value)) {
              isUnique = false;
              break;
            }
            else {
              values.add(value);
            }
          }
          if (isUnique) {
            idFields.push(dataColumn);
          }
        }
      }

      if (idFields.length === 0) {
        idFields.push(columns.find((x) => x.name === "--mr-index"));
      }

      return idFields;
    },
  )

  defaultIdField = () => {
    const { props } = this;
    return (
      this.possibleIdFields(props).find((x) => /^id$/i.test(x))
      ??
      this.possibleIdFields(props).find((x, i) => i === 0)
    );
  }

  getDataColumns = (dataFile) => {
    const dataColumns = [];
    for (const column of dataFile._content.columns) {
      const dataColumn = this.props.dataColumnsByFieldMap.get(column.name);
      if (dataColumn) {
        dataColumns.push(dataColumn);
      }
    }
    return dataColumns;
  }

  componentDidMount() {
    const { props } = this;

    if (props.isMasterDataset && !props.masterDataset?.idFieldName) {
      const idField = this.defaultIdField();
      if (idField) {
        props.onUpdateDataset(props.masterDataset.id, { idFieldName: idField.name });
      }
    }
  }

  render() {
    const { props } = this;

    const tableState = props.tableState;

    if (!props.masterDataset) {
      return (
        <React.Fragment>
          <div className="mr-section">
            <UiCombobox
              autoFocus
              error={!(props.masterDataset?.idFieldName)}
              // helperText="Each row must have an unique id (i.e. the column cannot contain an id more than once)"
              label="Main data file"
              onChange={
                (item) => {
                  const dataset = props.datasets.find((x) => x.file === item.id);
                  props.onSetMasterDataset(dataset.id);
                }
              }
              options={props.dataFiles}
              required
              // value={props.masterDataset?.idFieldName ?? this.defaultIdField()}
            />
          </div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <FileEditor
          fileId={tableState.file}
          label="Data File"
          paneId={props.tableId}
        />

        {
          (props.isMasterDataset) && (
            <div className="mr-section">
              <UiCombobox
                autoFocus
                error={!(props.masterDataset?.idFieldName)}
                // helperText="Each row must have an unique id (i.e. the column cannot contain an id more than once)"
                label={(props.masterDataset?.idFieldName) ? "ID column" : "Select an ID column (Each row must have an unique id)"}
                onChange={(item) => props.onUpdateDataset(props.masterDataset.id, { idFieldName: item.name })}
                options={this.possibleIdFields(props)}
                required
                value={props.masterDataset?.idFieldName ?? this.defaultIdField()}
              />
            </div>
          )
        }

        {
          (props.isMasterDataset) && (
            <Paper
              variant="outlined"
              style={fullSizeStyle}
            >
              {
                props.masterDataFile && (
                  <DataColumnsEditor
                    dataColumns={this.getDataColumns(props.masterDataFile)}
                  />
                )
              }
            </Paper>
          )
        }

        {
          props.isLinkedDataset && props.linkedDataFile && (
            <React.Fragment>
              <div className="mr-section">
                <Box display="flex" style={fullSizeStyle}>
                  <Box style={{ width: "50%" }}>
                    <UiCombobox
                      label={`Column in ${props.masterDataFile.name}`}
                      options={props.masterDataFile._content.columns}
                      onChange={
                        (item) => {
                          props.onUpdateDataset(
                            props.tableDataset.id,
                            { masterFieldName: item.name },
                          );
                        }
                      }
                      value={props.tableDataset?.masterFieldName}
                    />
                  </Box>
                  <Box style={{ width: "50%" }}>
                    <UiCombobox
                      label={`Column in ${props.linkedDataFile.name}`}
                      options={props.linkedDataFile._content.columns}
                      onChange={
                        (item) => {
                          props.onUpdateDataset(
                            props.tableDataset.id,
                            { linkFieldName: item.name },
                          );
                        }
                      }
                      value={props.tableDataset?.linkFieldName}
                    />
                  </Box>
                </Box>
              </div>
              <Paper
                  variant="outlined"
                  style={fullSizeStyle}
                >
                  {
                    props.linkedDataFile && props.tableDataset?.linkFieldName && (
                      <DataColumnsEditor
                        dataColumns={this.getDataColumns(props.linkedDataFile)}
                      />
                    )
                  }
                </Paper>
            </React.Fragment>
          )
        }

      </React.Fragment>
    );
  }

}

TablePaneEditor.displayName = "TablePaneEditor";

TablePaneEditor.propTypes = {
  dataColumns: PropTypes.arrayOf(DataColumn),
  dataColumnsByFieldMap: PropTypes.instanceOf(Map),
  dataFiles: PropTypes.array.isRequired,
  datasets: PropTypes.array.isRequired,
  isLinkedDataset: PropTypes.bool.isRequired,
  isMasterDataset: PropTypes.bool.isRequired,
  linkedDataFile: PropTypes.object.isRequired,
  masterDataFile: PropTypes.object,
  masterDataset: PropTypes.object,
  onSetMasterDataset: PropTypes.func.isRequired,
  onTablePropChange: PropTypes.func.isRequired,
  onUpdateDataset: PropTypes.func.isRequired,
  tableDataset: PropTypes.object.isRequired,
  tableId: PropTypes.string.isRequired,
  tableState: PropTypes.object.isRequired,
};

export default TablePaneEditor;
