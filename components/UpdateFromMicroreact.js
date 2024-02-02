import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import { createSelector } from "reselect";

import UiDialog from "./UiDialog.react";
import UiTextfield from "./UiTextfield.react";

class UpdateFromMicroreact extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isEditor: props.isEditor,
    };
  }

  panesSelector = createSelector(
    (props) => (props.layoutModel),
    (layoutModel) => {
      const panes = [];

      for (const node of Object.values(layoutModel._idMap)) {
        if (
          node._attributes.type === "tab"
          &&
          node._attributes.component
          &&
          !node._attributes.id.startsWith("#")
          &&
          !node._attributes.id.startsWith("--mr-")
        ) {
          panes.push({
            paneId: node._attributes.id,
            component: node._attributes.component,
            name: node._attributes.name,
          });
        }
      }

      return panes;
    },
  );

  renderStep() {
    const { props } = this;

    const pane = this.panesSelector(props).find((x) => x.paneId === props.paneId);

    if (!props.paneId || !pane) {
      return null;
    }

    const key = [ props.isEditor, props.isValidator, props.paneId ].join("-");

    if (pane.component === "Table") {
      return (
        <TablePaneEditor
          tableId={pane.paneId}
          key={key}
        />
      );
    }

    if (pane.component === "Map") {
      return (
        <MapPaneEditor
          mapId={pane.paneId}
          key={key}
        />
      );
    }

    if (pane.component === "Tree") {
      return (
        <TreePaneEditor
          treeId={pane.paneId}
          key={key}
        />
      );
    }

    if (pane.component === "Network") {
      return (
        <NetworkPaneEditor
          networkId={pane.paneId}
          key={key}
        />
      );
    }

    if (pane.component === "Timeline") {
      return (
        <TimelinePaneEditor
          timelineId={pane.paneId}
          key={key}
        />
      );
    }

    if (pane.component === "Slicer") {
      return (
        <SlicerPaneEditor
          slicerId={pane.paneId}
          key={key}
        />
      );
    }

    return null;
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
        maxWidth="md"
        onClose={props.onClose}
        title="Upload project from .microreact file"
      >
        <p>
          Select a <code>.microreact</code> file to update this project.
        </p>
        <p>
          <UiTextfield
            type="file"
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
