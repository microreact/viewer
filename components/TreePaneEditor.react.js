import PropTypes from "prop-types";
import React from "react";
import Paper from "@material-ui/core/Paper";
import { createSelector } from "reselect";

import { fullSizeStyle } from "../constants";
import { newickLabels } from "../utils/trees";

import FileEditor from "../containers/FileEditor.react";
import MiniTable from "./MiniTable.react";
import UiCombobox from "./UiCombobox.react";

class TreePaneEditor extends React.PureComponent {

  allowedFieldsSelector = createSelector(
    (props) => props.mergedDataset,
    (props) => props.treeFile?._content,
    (
      dataFile,
      treeFileContent,
    ) => {
      const allowedFields = [];
      if (treeFileContent) {
        const treeLabels = new Set(newickLabels(treeFileContent));
        for (const field of dataFile.columns) {
          for (const row of dataFile.rows) {
            if (treeLabels.has(row[field.name]?.toString())) {
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

    if (!props.treeState.labelField) {
      const labelField = this.defaultLabelField();
      if (labelField) {
        props.onTreePropChange("labelField", labelField.name);
      }
    }
  }

  render() {
    const { props } = this;
    const { treeState } = props;

    return (
      <React.Fragment>
        <FileEditor
          fileId={treeState.file}
          label="Tree File"
          paneId={props.treeId}
        />

        {
          props.treeFile && (
            <UiCombobox
              autoFocus={!treeState.labelField}
              error={!treeState.labelField}
              helperText="Choose the metadata column which contains tree leaf labels"
              label="Labels Column"
              onChange={(value) => props.onTreePropChange("labelField", value.name)}
              options={this.allowedFieldsSelector(props)}
              required
              value={treeState.labelField ?? this.defaultLabelField()}
            />
          )
        }

        {
          props.treeFile && (
            <Paper
              style={fullSizeStyle}
              variant="outlined"
            >
                <MiniTable
                  activeFields={this.allowedFieldsSelector(props)}
                  data={props.mergedDataset}
                  inactiveColumnTitle="This column does not contain tree labels"
                  onHeaderClick={(header) => props.onTreePropChange("labelField", header.name)}
                />
            </Paper>
          )
        }

    </React.Fragment>
    );
  }

}

TreePaneEditor.displayName = "TreePaneEditor";

TreePaneEditor.propTypes = {
  mergedDataset: PropTypes.object.isRequired,
  onTreePropChange: PropTypes.func.isRequired,
  treeFile: PropTypes.object,
  treeId: PropTypes.string.isRequired,
  treeState: PropTypes.object.isRequired,
};

export default TreePaneEditor;
