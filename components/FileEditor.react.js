import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import PropTypes from "prop-types";
import React from "react";
import validUrl from "valid-url";
import SaveTwoToneIcon from "@material-ui/icons/SaveTwoTone";
import InsertDriveFileTwoToneIcon from "@material-ui/icons/InsertDriveFileTwoTone";
import LinkTwoToneIcon from "@material-ui/icons/LinkTwoTone";
import HighlightOffTwoToneIcon from "@material-ui/icons/HighlightOffTwoTone";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";

import "../css/panes-editor.css";
import { nextTick } from "../utils/browser";

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
      this.props.onFileChange(event.target.files[0]);
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
  file: PropTypes.object,
  onFileChange: PropTypes.func.isRequired,
};

FileEditor.defaultProps = {
  variant: "outlined",
  size: "small",
};

export default FileEditor;
