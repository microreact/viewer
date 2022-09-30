import PropTypes from "prop-types";
import React from "react";
import Paper from "@mui/material/Paper";
import { createSelector } from "reselect";

import { fullSizeStyle } from "../constants";
import { graphLabels } from "../utils/networks";

import UiCombobox from "./UiCombobox.react";
import FileEditor from "../containers/FileEditor.react";
import MiniTable from "./UiMiniTable.react";

class NetworkPaneEditor extends React.PureComponent {

  allowedFieldsSelector = createSelector(
    (props) => props.mergedDataset,
    (data) => data.networkFile?._content,
    (
      dataFile,
      networkFileContent,
    ) => {
      const allowedFields = [];

      if (networkFileContent) {
        const nodeLabels = new Set(graphLabels(networkFileContent));
        for (const field of dataFile.columns) {
          for (const row of dataFile.rows) {
            if (nodeLabels.has(row[field.name])) {
              allowedFields.push(field);
              break;
            }
          }
        }
      }

      return allowedFields;
    },
  )

  defaultLabelField = () => {
    const { props } = this;
    return (
      this.allowedFieldsSelector(props).find((x, i) => i === 0)
    );
  }

  componentDidMount() {
    const { props } = this;

    if (!props.networkState.nodeField) {
      const nodeField = this.defaultLabelField();
      if (nodeField) {
        props.onNetworkPropChange("nodeField", nodeField.name);
      }
    }
  }

  render() {
    const { props } = this;

    return (
      <React.Fragment>
        <FileEditor
          fileId={props.networkState.file}
          label="Network File"
          paneId={props.networkId}
        />

        {
          props.networkFile && (
            <UiCombobox
              autoFocus={!props.networkState.nodeField}
              error={!props.networkState.nodeField}
              helperText="Choose the metadata column which contains network node labels"
              label="Labels Column"
              onChange={(value) => props.onNetworkPropChange("nodeField", value.name)}
              options={this.allowedFieldsSelector(props)}
              required
              value={props.networkState.nodeField ?? this.defaultLabelField()}
            />
          )
        }

        {
          props.networkFile && (
            <Paper
              style={fullSizeStyle}
              variant="outlined"
            >
                <MiniTable
                  activeFields={this.allowedFieldsSelector(props)}
                  data={props.mergedDataset}
                  inactiveColumnTitle="This column does not contain network node labels"
                  onHeaderClick={(header) => props.onNetworkPropChange("nodeField", header.name)}
                />
            </Paper>
          )
        }

      </React.Fragment>
    );
  }

}

NetworkPaneEditor.displayName = "NetworkPaneEditor";

NetworkPaneEditor.propTypes = {
  mergedDataset: PropTypes.object.isRequired,
  networkFile: PropTypes.object.isRequired,
  networkId: PropTypes.string.isRequired,
  networkState: PropTypes.object.isRequired,
  onNetworkPropChange: PropTypes.func.isRequired,
};

export default NetworkPaneEditor;
