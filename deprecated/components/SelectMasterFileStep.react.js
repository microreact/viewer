import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import React from "react";
import { createSelector } from "reselect";

import UiCombobox from "./UiCombobox.react";
import MiniTable from "./MiniTable.react";

class SelectMasterFileStep extends React.PureComponent {

  static displayName = "SelectMasterFileStep"

  static propTypes = {
    data: PropTypes.object,
  }

  state = {
    data: {},
  }

  getDerivedData = () => {
    return {
      ...this.props.data,
      ...this.state.data,
    };
  }

  setData = (updater) => {
    this.setState({
      data: {
        ...this.state.data,
        ...updater,
      },
    });
  }

  possibleIdFields = createSelector(
    (data) => data.masterDataFile.content,
    ({ rows, fields }) => {
      const idFields = [];
      for (const field of fields) {
        const values = new Set();
        let isUnique = true;
        for (const row of rows) {
          if (values.has(row[field.name])) {
            isUnique = false;
            break;
          }
          else {
            values.add(row[field.name]);
          }
        }
        if (isUnique) {
          idFields.push(field);
        }
      }
      return idFields;
    },
  )

  handleContinue = () => {
    const data = this.getDerivedData();

    const masterDataFile = data.masterDataFile;
    if (masterDataFile && data.idDataField) {
      return [
        masterDataFile,
        { idFieldName: data.idDataField.name },
      ];
    }

    return false;
  }

  render() {
    const data = this.getDerivedData();

    const masterDataFile = data.masterDataFile;
    const masterDataFields = (masterDataFile) ? masterDataFile.content.fields : null;
    return (
      <Box display="flex" style={{ width: "100%", height: "100%" }}>
        <Box style={{ width: "50%" }}>
          <p>
            Each row must have an unique id. Which column contains the ids?
          </p>
          <p>
            Note: the column cannot contain an id more than once.
          </p>
          <div
            className="mr-section"
            hidden={data.dataFiles.length === 1}
          >
            <UiCombobox
              label="Main data file"
              options={data.dataFiles}
              onChange={(item) => this.setData({ masterDataFile: item, idDataField: null })}
              value={masterDataFile}
            />
          </div>
          {
            (masterDataFields) && (
              <div className="mr-section">
                <UiCombobox
                  label="ID column"
                  options={this.possibleIdFields(data)}
                  onChange={(item) => this.setData({ idDataField: item })}
                  value={data.idDataField}
                />
              </div>
            )
          }
        </Box>
        <Box style={{ width: "50%" }}>
          {
            masterDataFile && (
              <MiniTable
                data={masterDataFile.content}
                activeFields={this.possibleIdFields(data)}
                inactiveColumnTitle="This column is not unique"
                onHeaderClick={
                  (header) => {
                    this.setData({ idDataField: header });
                  }
                }
              />
            )
          }
        </Box>
      </Box>
    );
  }

}

export default SelectMasterFileStep;
