/* eslint-disable class-methods-use-this */

import { createSelector } from "reselect";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import React from "react";
import { filesize } from "filesize";
import TextField from "@material-ui/core/TextField";
import WebAssetTwoToneIcon from "@material-ui/icons/WebAssetTwoTone";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { getContainerElement } from "../utils/html";
import UiDialog from "./UiDialog.react";
import PaneIcon from "./PaneIcon.react";
import SaveAltOutlinedIcon from "@material-ui/icons/SaveAltOutlined";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";

import "../css/files-dialog.css";
import DropFiles from "../containers/DropFiles.react";

import { downloadDataUrl } from "../utils/downloads";

const initialState = {
  isDialogOpen: false,
};

const icons = {
  "data": "Table",
  "network": "Network",
  "tree": "Tree",
  "geo": "Map",
};

class FilesDialog extends React.PureComponent {

  state = initialState;

  dialogRef = React.createRef()

  openDialog = () => {
    this.dialogRef.current?.open();
  }

  filesSelector = createSelector(
    (filesState) => filesState,
    (filesState) => {
      const items = [];

      for (const file of Object.values(filesState)) {
        items.push({
          ...file,
          label: file.name || `${file.type} file`,
        });
      }

      return items;
    }
  );

  renderFileLink = (file) => {
    if (file.url) {
      return (
        <a href={file.url}>
          { file.url }
        </a>
      );
    }

    if (file.blob) {
      return (
        <button
        >
          { file.label }
        </button>
      );
    }
  }

  renderActions = () => {
    const { props } = this;

    return (
      <React.Fragment>
        <DropFiles>
          <Button
            startIcon={<AddCircleOutlineRoundedIcon />}
          >
            add more files
          </Button>
        </DropFiles>
        <Button
          onClick={props.onAddUrls}
        >
          add URLs
        </Button>
      </React.Fragment>
    );
  }

  render() {
    const { props } = this;

    return (
      <UiDialog
        actions={this.renderActions()}
        className="mr-files-dialog"
        container={getContainerElement}
        disableBackdropClick
        fullWidth
        maxWidth="md"
        onClose={this.closeDialog}
        ref={this.dialogRef}
        title="Project Files"
      >
        <List
          disablePadding
        >
          {
            this.filesSelector(props.files).map(
              (item) => (
                <React.Fragment key={item.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar variant="rounded">
                        <PaneIcon component={icons[item.type]} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.label}
                      secondary={item.size ? filesize(item.size) : item.url}
                    />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => props.onRemoveFile(item.id)}
                    >
                      <DeleteTwoToneIcon />
                    </IconButton>
                    {/* <IconButton edge="end">
                      <EditTwoToneIcon />
                    </IconButton> */}
                    <IconButton
                      edge="end"
                      href={item.url ?? undefined}
                      target={item.url ? "_blank" : undefined}
                      download={item.url ? item.name : undefined}
                      onClick={item.blob ? () => downloadDataUrl(item.blob, item.name, item.format) : undefined}
                    >
                      <SaveAltOutlinedIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              )
            )
          }
        </List>
      </UiDialog>
    );
  }

}

FilesDialog.propTypes = {
  onRemoveFile: PropTypes.func,
  files: PropTypes.object,
};

FilesDialog.defaultProps = {
};

FilesDialog.displayName = "FilesDialog";

export default FilesDialog;
