import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import PropTypes from "prop-types";
import React from "react";
import validUrl from "valid-url";
import SaveTwoToneIcon from "@mui/icons-material/SaveTwoTone";
import InsertDriveFileTwoToneIcon from "@mui/icons-material/InsertDriveFileTwoTone";
import LinkTwoToneIcon from "@mui/icons-material/LinkTwoTone";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";

// import "../styles/panes-editor.css";
import { nextTick } from "../utils/browser";
import { matrix } from "echarts";

class FileEditor extends React.PureComponent {

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     ...props.file,
  //   };
  // }

  state = {
    url: undefined,
  }

  inputRef = React.createRef()

  fileInputRef = React.createRef()

  handleClick = () => {
    this.fileInputRef.current.value = null;
    this.fileInputRef.current.click();
  };

  editUrl = (url = "") => {
    this.setState(
      { url },
      () => nextTick(() => this.inputRef.current.focus()),
    );
  }

  onFileInputChange = (event) => {
    if (event.target.files && event.target.files.length === 1) {
      const { name, format, size } = event.target.files[0];
      const file = {
        name,
        format,
        size,
        blob: event.target.files[0],
        type: this.props.defaultFileType,
      };
      this.props.onFileChange(file);
    }
  };

  onSaveUrl = () => {
    const { url } = this.state;
    const { format } = this.props.file;
    this.props.onFileChange({ url, format });
  };

  renderInput() {
    const { props } = this;

    if (this.state.url || this.state.url === "") {
      const isValidUrl = (this.state.url === "") || validUrl.isUri(this.state.url);
      return (
        <OutlinedInput
          autoFocus
          endAdornment={
            <InputAdornment position="end">
              {
                this.state.url && (
                  <IconButton
                    title={isValidUrl ? "Save new URL" : "Invalid URL"}
                    onClick={this.onSaveUrl}
                    edge="end"
                    disabled={!isValidUrl}
                  >
                    <SaveTwoToneIcon />
                  </IconButton>
                )
              }
              <IconButton
                title="Cancel"
                onClick={() => this.setState({ url: undefined })}
                edge="end"
              >
                <HighlightOffTwoToneIcon />
              </IconButton>
            </InputAdornment>
          }
          inputRef={this.inputRef}
          label={props.label}
          onChange={(event) => this.setState({ url: event.target.value })}
          placeholder="Enter URL"
          value={this.state.url || ""}
          error={!isValidUrl}
        />
      );
    }

    if (!props.file) {
      return (
        <OutlinedInput
          autoFocus
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={this.handleClick}
                title="Replace file"
              >
                <input
                  onChange={this.onFileInputChange}
                  ref={this.fileInputRef}
                  style={{ display: "none" }}
                  type="file"
                />
                <InsertDriveFileTwoToneIcon />
              </IconButton>
            </InputAdornment>
          }
          inputRef={this.inputRef}
          label={props.label}
          onChange={(event) => this.setState({ url: event.target.value })}
          placeholder="Enter URL or select a file"
          value={this.state.url || ""}
        />
      );
    }

    if (this.props.file?.blob || this.props.file?.name) {
      return (
        <OutlinedInput
          label={props.label}
          value={this.props.file.blob?.name ?? this.props.file?.name}
          readOnly
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={this.handleClick}
                title="Replace file"
              >
                <input
                  onChange={this.onFileInputChange}
                  ref={this.fileInputRef}
                  style={{ display: "none" }}
                  type="file"
                />
                <InsertDriveFileTwoToneIcon />
              </IconButton>
              <IconButton
                title="Enter URL"
                onClick={() => this.editUrl()}
                edge="end"
              >
                <LinkTwoToneIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      );
    }

    if (this.props.file?.url) {
      return (
        <OutlinedInput
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={this.handleClick}
                title="Replace file"
              >
                <input
                  onChange={this.onFileInputChange}
                  ref={this.fileInputRef}
                  style={{ display: "none" }}
                  type="file"
                />
                <InsertDriveFileTwoToneIcon />
              </IconButton>
              <IconButton
                title="Edit URL"
                onClick={() => this.editUrl(this.props.file.url)}
                edge="end"
              >
                <EditTwoToneIcon />
              </IconButton>
            </InputAdornment>
          }
          label={props.label}
          onChange={(event) => this.setState({ url: event.target.value })}
          value={this.props.file?.url}
        />
      );
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.file !== prevProps.file) {
      this.setState({ url: undefined });
    }
  }

  render() {
    const { props } = this;
    const { size, variant, label } = props;

    return (
      <FormControl
        size={size}
        variant={variant}
      >
        <InputLabel>
          { label }
        </InputLabel>
        { this.renderInput() }
      </FormControl>
    );
  }

}

FileEditor.displayName = "FileEditor";

FileEditor.propTypes = {
  defaultFileType: PropTypes.string,
  file: PropTypes.object,
  label: PropTypes.string,
  onFileChange: PropTypes.func.isRequired,
};

FileEditor.defaultProps = {
  variant: "outlined",
  size: "small",
};

export default FileEditor;
