import PropTypes from "prop-types";
import React from "react";
import Paper from "@material-ui/core/Paper";
import { createSelector } from "reselect";

import { fullSizeStyle } from "../constants";
import { newickLabels } from "../utils/trees";

import FileEditor from "../containers/FileEditor.react";
import MiniTable from "./MiniTable.react";
import UiCombobox from "./UiCombobox.react";
import UiToggleSwitch from "./UiToggleSwitch.react";

class TreePaneEditor extends React.PureComponent {

  leafLabelsSelector = createSelector(
    (props) => props.treeFile?._content,
    (
      treeFileContent,
    ) => {
      if (treeFileContent) {
        const treeLabels = new Set(newickLabels(treeFileContent));
        return treeLabels;
      }
      return undefined;
    },
  )

  allowedFieldsSelector = createSelector(
    (props) => props.mergedDataset,
    this.leafLabelsSelector,
    (
      dataFile,
      treeLabels,
    ) => {
      const allowedFields = [];
      if (treeLabels) {
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

  numberOfOrphanDataRows = () => {
    const mergedDataset = this.props.mergedDataset;
    const treeLabels = this.leafLabelsSelector(this.props);
    if (treeLabels) {
      return mergedDataset.rows.length - treeLabels.size;
    }
    return 0;
  }

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
    const numberOfOrphanDataRows = this.numberOfOrphanDataRows();

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

        {
          (numberOfOrphanDataRows > 0) && (
            <UiToggleSwitch
              label={
                <React.Fragment>
                  Hide <strong>{numberOfOrphanDataRows}</strong> data {numberOfOrphanDataRows === 1 ? "entry" : "entries"} without matching tree leaves
                </React.Fragment>
              }
              onChange={(value) => props.onTreePropChange("hideOrphanDataRows", value)}
              value={treeState.hideOrphanDataRows}
            />
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
