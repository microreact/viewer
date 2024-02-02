import { createSelector } from "reselect";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

// import "../styles/files-queue.css";

import { FileKinds } from "../utils/files";
import { generateHashId } from "../utils/hash";
import UiDialog from "./UiDialog.react";
import UiTextfield from "./UiTextfield.react";
import { FileDescriptor } from "../utils/prop-types";

const fileNameCellStyle = { maxWidth: "680px" };
const fileKindCellStyle = { width: "240px", minWidth: "240px", maxWidth: "240px" };

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

    return props.onCommitFiles(files);
  };

  filesSelector = createSelector(
    (props) => props.pendingFiles,
    (pendingFiles) => {
      const files = [ ...pendingFiles ];

      // if (files.length === 0 || files[files.length - 1].url !== "") {
      //   files.push({
      //     url: "",
      //     id: generateHashId(),
      //   });
      // }

      return files;
    },
  );

  handleFileChange = (file, updater) => {
    const files = [ ...this.props.pendingFiles ];

    const fileIndex = files.indexOf(file);
    if (fileIndex >= 0) {
      if (updater === undefined) {
        files.splice(fileIndex, 1);
      }
      else {
        files[fileIndex] = {
          ...files[fileIndex],
          ...updater,
        };
      }
    }
    else {
      files.push({
        ...(file || {}),
        ...updater,
      });
    }

    this.props.onPendingFileChange(files);
  };

  handleFormatChange = (file, value) => {
    const { type, format } = FileKinds.find((x) => `${x.type}-${x.format}` === value);
    this.handleFileChange(file, { type, format });
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
    const newFileId = generateHashId();
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
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>File</TableCell>
                  <TableCell style={fileKindCellStyle}>File kind</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  files.map(
                    (row) => {
                      let fileNameCell;

                      if (typeof row.url === "string") {
                        fileNameCell = (
                          <UiTextfield
                            clearable={!!row.url}
                            label="Enter URL"
                            onChange={(value) => this.handleFileChange(row, { "url": value })}
                            size="small"
                            style={{ width: "100%" }}
                            value={row.url ?? ""}
                            variant="outlined"
                          />
                        );
                      }
                      else {
                        fileNameCell = (
                          <UiTextfield
                            clearable
                            onChange={(value) => this.handleFileChange(row, undefined)}
                            readOnly
                            size="small"
                            style={{ width: "100%" }}
                            value={row.name}
                            variant="outlined"
                          />
                        );
                      }

                      return (
                        <TableRow key={row.id}>
                          <TableCell style={fileNameCellStyle}>
                            { fileNameCell }
                            { this.renderFileError(row.id) }
                          </TableCell>
                          <TableCell style={fileKindCellStyle}>
                            <TextField
                              select
                              label=""
                              value={(row.type && row.format) ? `${row.type}-${row.format}` : ""}
                              onChange={(event) => this.handleFormatChange(row, event.target.value)}
                              variant="outlined"
                              size="small"
                              style={{ width: "100%" }}
                              required
                            >
                              {
                                FileKinds.filter((x) => x.linkable).map(
                                  (option) => (
                                    <MenuItem
                                      key={`${option.type}-${option.format}`}
                                      value={`${option.type}-${option.format}`}
                                    >
                                      { option.name }
                                    </MenuItem>
                                  )
                                )
                              }
                            </TextField>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )
                }
                <TableRow key={newFileId}>
                  <TableCell>
                    <UiTextfield
                      label="Enter URL"
                      onChange={(value) => this.handleFileChange({ id: newFileId }, { "url": value })}
                      size="small"
                      style={{ width: "100%" }}
                      value={""}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell style={fileKindCellStyle}>
                    <Box display="flex">
                      <Button
                        onClick={props.onBrowseFiles}
                        startIcon={<AddCircleOutlineRoundedIcon />}
                      >
                        add more files
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
      </UiDialog>
    );
  }

}

FilesQueue.displayName = "AddFilesStep";

FilesQueue.propTypes = {
  onBrowseFiles: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onCommitFiles: PropTypes.func.isRequired,
  onPendingFileChange: PropTypes.func.isRequired,
  pendingFiles: PropTypes.arrayOf(FileDescriptor),
};

export default FilesQueue;
