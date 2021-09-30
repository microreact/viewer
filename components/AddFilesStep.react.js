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

import { FileKinds } from "../utils/files";
import { generateHashId } from "../utils/hash";
import UiDialog from "./UiDialog.react";

class AddFilesStep extends React.PureComponent {

  static displayName = "AddFilesStep"

  static propTypes = {
    data: PropTypes.object,
  }

  state = {
    data: {},
  }

  getDerivedData = () => {
    return {
      files: this.props.pendingFiles,
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

  handleContinue = () => {
    const { props } = this;

    const data = this.getDerivedData();

    for (const file of data.files) {
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

    return props.onAddFiles(data.files.filter((x) => x.url !== ""));
  }

  filesSelector = createSelector(
    (data) => data.files,
    (dataFiles) => {
      const files = [ ...dataFiles ];

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
    const data = this.getDerivedData();
    const files = this.filesSelector(data);
    files[files.indexOf(file)] = {
      ...files[files.indexOf(file)],
      [key]: value,
    };
    this.setData({
      files,
    });
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
    const data = this.getDerivedData();
    const files = this.filesSelector(data);

    return (
      <UiDialog
        actions={
          <React.Fragment>
            <Button
              variant="outlined"
              disableElevation
              onClick={props.onClose}
            >
              Close
            </Button>
            <Button
              color="primary"
              variant="contained"
              disableElevation
              onClick={this.handleContinue}
            >
              Continue
            </Button>
          </React.Fragment>
        }
        className="mr-add-files-dialog"
        isOpen
        maxWidth="md"
        onClose={props.onClose}
        title="Add Files or URLs"
      >
        <Box style={{ width: "100%", height: "100%", margin: "-8px" }}>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>File</TableCell>
                  {/* <TableCell align="right"></TableCell> */}
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
                          <TextField
                            label="Enter URL"
                            value={row.url ?? ""}
                            onChange={(event) => this.handleFileChange(row, "url", event.target.value)}
                            variant="outlined"
                            size="small"
                            style={{ width: "100%" }}
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
                        fileNameCell = row.name;
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

export default AddFilesStep;
