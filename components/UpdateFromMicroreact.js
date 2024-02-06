import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import React from "react";
import { createSelector } from "reselect";

import UiDialog from "./UiDialog.react";
import UiTextfield from "./UiTextfield.react";
import FileEditor from "../containers/FileEditor.react";

class UpdateFromMicroreact extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isEditor: props.isEditor,
    };
  }

  renderActions() {
    const { props } = this;

    const pane = this.panesSelector(props).find((x) => x.paneId === props.paneId);

    return (
      <React.Fragment>
        {
          (!props.isValidator && pane) && (
            <Button
              variant="outlined"
              disableElevation
              onClick={() => props.onRemovePane(pane.paneId)}
              className="mr-remove-pane"
            >
              Remove { pane.component }
            </Button>
          )
        }
        {
          (!props.isValidator) && (
            <Button
              variant="outlined"
              disableElevation
              onClick={props.onClose}
            >
              Close
            </Button>
          )
        }
        {
          (props.isValidator) && (
            <Button
              color="primary"
              variant="contained"
              disableElevation
              onClick={props.onContinue}
            >
              Continue
            </Button>
          )
        }
      </React.Fragment>
    );
  }

  render() {
    const { props } = this;

    return (
      <UiDialog
        // actions={this.renderActions()}
        // disableDividers
        fullWidth
        isOpen
        maxWidth="sm"
        onClose={props.onClose}
        title="Upload project from .microreact file"
      >
        <p>
          Select a <code>.microreact</code> file to update this project.
        </p>
        <p>
          {/* <UiTextfield
            type="file"
          /> */}
          <FileEditor
            label="Select a .microreact file"
          />
        </p>
      </UiDialog>
    );
  }

}

UpdateFromMicroreact.displayName = "UpdateFromMicroreact";

UpdateFromMicroreact.propTypes = {
  isEditor: PropTypes.bool.isRequired,
  isValidator: PropTypes.bool.isRequired,
  layoutModel: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  onEditPane: PropTypes.func.isRequired,
  onRemovePane: PropTypes.func.isRequired,
  paneId: PropTypes.string,
};

export default UpdateFromMicroreact;
