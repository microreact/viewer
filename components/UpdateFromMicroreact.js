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
      <div>
        <p>
          Select a <code>.microreact</code> file to update this project.
        </p>
        <p>
          <FileEditor
            label="Select a .microreact file"
          />
        </p>
        <ul>
          <li>
            To preserve a snapshot of the existing project prior to overriding with the new project file, download the current .microreact file or save a copy as a new project
          </li>
          <li>
            After replacing the .microreact file, save the project, or exit without saving to revert to the original
          </li>
          <li>
            The project sharing settings and link will not change
          </li>
        </ul>
      </div>
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
