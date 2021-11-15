import { createSelector } from "reselect";
import Box from "@material-ui/core/Box";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";

import "../css/files-queue.css";

import { FileKinds } from "../utils/files";
import { generateHashId } from "../utils/hash";
import UiDialog from "./UiDialog.react";
import UiTextfield from "./UiTextfield.react";
import { FileDescriptor } from "../utils/prop-types";

class FilesQueue extends React.PureComponent {

  handleContinue = () => {
    const { props } = this;

    const files = props.pendingFiles;

    for (const file of files) {
      if (
        typeof file.url === "string"
        &&
        !!file.url
        &&
        !file.format
      ) {
        return false;
      }

      if (
        typeof file.url !== "string"
        &&
        !file.format
      ) {
        return false;
      }
    }

    return props.onAddFiles(files);
  }

  filesSelector = createSelector(
    (props) => props.pendingFiles,
    (pendingFiles) => {
      const files = [ ...pendingFiles ];

      if (files.length === 0 || files[files.length - 1].url !== "") {
        files.push({
          url: "",
          id: generateHashId(),
        });
      }

      return files;
    },
  )

  handleFileChange = (file, key, value) => {
    const files = [ ...this.props.pendingFiles ];

    const fileIndex = files.indexOf(file);
    if (fileIndex >= 0) {
      if (value === undefined) {
        files.splice(fileIndex, 1);
      }
      else {
        files[fileIndex] = {
          ...files[fileIndex],
          [key]: value,
        };
      }
    }
    else {
      files.push({
        ...file,
        [key]: value,
      });
    }

    this.props.onPendingFileChange(files);
  };

  renderFileError(fileId) {
    if (this.props?.pendingFiles && this.props.pendingFiles.find((x) => x.id === fileId)?.error) {
      return (
        <strong>
          &nbsp;
          ERROR:
          &nbsp;
          { this.props.pendingFiles.find((x) => x.id === fileId)?.error }
        </strong>
      );
    }
    return null;
  }

  render() {
    const { props } = this;
    const files = this.filesSelector(props);

    return (
      <UiDialog
        className="mr-files-queue"
        actions={
          <React.Fragment>
            <Button
              variant="outlined"
              disableElevation
              onClick={props.onClose}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              disableElevation
              onClick={this.handleContinue}
              disabled={this.props.pendingFiles?.length === 0}
            >
              Continue
            </Button>
          </React.Fragment>
        }
        isOpen
        maxWidth="md"
        onClose={props.onClose}
        title="Add Files or URLs"
      >
        <Box style={{ width: "100%", height: "100%", margin: "-8px" }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>File</TableCell>
                  <TableCell>File kind</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  files.map(
                    (row, index) => {
                      let fileNameCell;
                      let fileKindCell = (
                        <TextField
                          select
                          label="File kind"
                          value={row.format ?? ""}
                          onChange={(event) => this.handleFileChange(row, "format", event.target.value)}
                          variant="outlined"
                          size="small"
                          style={{ width: "100%" }}
                          required
                        >
                          {
                            FileKinds.filter((x) => x.linkable).map(
                              (option) => (
                                <MenuItem key={option.format} value={option.format}>
                                  { option.name }
                                </MenuItem>
                              )
                            )
                          }
                        </TextField>
                      );

                      if (typeof row.url === "string") {
                        fileNameCell = (
                          <UiTextfield
                            clearable={!!row.url}
                            label="Enter URL"
                            onChange={(value) => this.handleFileChange(row, "url", value)}
                            size="small"
                            style={{ width: "100%" }}
                            value={row.url ?? ""}
                            variant="outlined"
                          />
                        );
                        if (!row.url && (index === files.length - 1)) {
                          fileKindCell = (
                            <Box display="flex">
                              <Button
                                onClick={props.onLoadFiles}
                                startIcon={<AddCircleOutlineRoundedIcon />}
                              >
                                add more files
                              </Button>
                            </Box>
                          );
                        }
                      }
                      else {
                        fileNameCell = (
                          <UiTextfield
                            clearable
                            readOnly
                            size="small"
                            style={{ width: "100%" }}
                            value={row.name}
                            variant="outlined"
                            onChange={(value) => this.handleFileChange(row, "blob", undefined)}
                          />
                        );
                      }

                      return (
                        <TableRow key={row.id}>
                          <TableCell>
                            { fileNameCell }
                            { this.renderFileError(row.id) }
                          </TableCell>
                          <TableCell style={{ maxWidth: "160px" }}>
                            { fileKindCell }
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </UiDialog>
    );
  }

}

FilesQueue.displayName = "AddFilesStep";

FilesQueue.propTypes = {
  onClose: PropTypes.func.isRequired,
  onLoadFiles: PropTypes.func.isRequired,
  onPendingFileChange: PropTypes.func.isRequired,
  pendingFiles: PropTypes.arrayOf(FileDescriptor),
};

export default FilesQueue;
