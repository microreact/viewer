import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import React from "react";
import { createSelector } from "reselect";

import UiCombobox from "./UiCombobox.react";
import MiniTable from "./MiniTable.react";
import { graphLabels } from "../utils/networks";

class LinkNetworkFileStep extends React.PureComponent {

  static displayName = "LinkNetworkFileStep"

  static propTypes = {
    data: PropTypes.object,
  }

  state = {
    data: {},
  }

  getDerivedData = () => {
    const data = {
      ...this.props.data,
      ...this.state.data,
    };

    if (!data.masterDataField) {
      const options = this.allowedFieldsSelector(data);
      if (options.length) {
        if (options.includes(data.idDataField)) {
          data.masterDataField = data.idDataField;
        }
        else {
          data.masterDataField = options[0];
        }
      }
    }

    return data;
  }

  setData = (updater) => {
    this.setState({
      data: {
        ...this.state.data,
        ...updater,
      },
    });
  }

  allowedFieldsSelector = createSelector(
    (data) => data.masterDataFile.content,
    (data) => data.networkFile.content,
    (
      dataFile,
      networkFile,
    ) => {
      const nodeLabels = new Set(graphLabels(networkFile));
      const allowedFields = [];
      for (const field of dataFile.fields) {
        for (const row of dataFile.rows) {
          if (nodeLabels.has(row[field.name])) {
            allowedFields.push(field);
            break;
          }
        }
      }
      return allowedFields;
    },
  )

  handleContinue = () => {
    const data = this.getDerivedData();

    if (data.masterDataField) {
      return [
        data.networkFile,
        { labelFieldName: data.masterDataField.name },
      ];
    }

    return false;
  }

  render() {
    const data = this.getDerivedData();
    const options = this.allowedFieldsSelector(data);
    return (
      <Box display="flex" style={{ width: "100%", height: "100%" }}>
        <Box style={{ width: "50%" }}>
          <p>
            Choose the metadata column which contains network node labels.
          </p>
          <div className="mr-section">
            <UiCombobox
              label="Metadata column"
              options={options}
              onChange={(item) => this.setData({ masterDataField: item })}
              value={data.masterDataField}
            />
          </div>
        </Box>
        <Box style={{ width: "50%" }}>
          <MiniTable
            data={data.masterDataFile.content}
            activeFields={options}
            inactiveColumnTitle="This column does not contain network node labels"
            onHeaderClick={
              (header) => {
                this.setData({ idDataField: header });
              }
            }
          />
        </Box>
      </Box>
    );
  }

}

export default LinkNetworkFileStep;
