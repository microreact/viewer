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

// import "../styles/panes-editor.css";

import MapPaneEditor from "../containers/MapPaneEditor.react";
import MatrixPaneEditor from "../containers/MatrixPaneEditor.js";
import NetworkPaneEditor from "../containers/NetworkPaneEditor.react";
import PaneIcon from "./PaneIcon.react";
import SlicerPaneEditor from "../containers/SlicerPaneEditor.react";
import TablePaneEditor from "../containers/TablePaneEditor.react";
import TimelinePaneEditor from "../containers/TimelinePaneEditor.react";
import TreePaneEditor from "../containers/TreePaneEditor.react";
import UiDialog from "./UiDialog.react";
import UpdateFromMicroreact from "./UpdateFromMicroreact.js";

class PaneEditor extends React.PureComponent {

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

    if (props.paneId === "--mr-replace-project") {
      return (
        <UpdateFromMicroreact />
      );
    }

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

    if (pane.component === "Matrix") {
      return (
        <MatrixPaneEditor
          matrixId={pane.paneId}
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

  renderNav() {
    const { props } = this;
    if (this.state.isEditor) {
      return (
        <Paper
          variant="outlined"
          className="mr-panes-list"
        >
          <List
            component="nav"
            dense
            disablePadding
          >
            {
              this.panesSelector(props).map(
                (pane) => (
                  <ListItem
                    button
                    disableGutters
                    key={pane.paneId}
                    onClick={() => props.onEditPane(pane.paneId)}
                    selected={props.paneId === pane.paneId}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <PaneIcon component={pane.component} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={pane.name}
                      secondary={<small><code>{pane.paneId}</code></small>}
                    />
                  </ListItem>
                )
              )
            }
            <div style={{ flexGrow: "1" }} />
            <ListItem
              button
              disableGutters
              onClick={() => props.onEditPane("--mr-replace-project")}
              selected={props.paneId === "--mr-replace-project"}
            >
              <ListItemText
                primary="Replace project"
              />
            </ListItem>
          </List>
        </Paper>
      );
    }
    else {
      return null;
    }
  }

  renderTitle() {
    const { props } = this;
    const pane = this.panesSelector(props).find((x) => x.paneId === props.paneId);
    if (pane) {
      const node = props.layoutModel.getNodeById(this.props.paneId);
      if (props.isEditor) {
        return `Edit Panel: ${node?._attributes.name}`;
      }
      else if (props.isValidator) {
        return (
          (node?._attributes.component === "Table")
            ?
            "Data Table"
            :
            node?._attributes.component
        );
      }
      else {
        return node?._attributes.name;
      }
    }
    else {
      return "Select a panel to edit";
    }
  }

  render() {
    const { props } = this;

    const isOpen = props.isEditor || props.isValidator;

    if (!isOpen) {
      return null;
    }

    return (
      <UiDialog
        actions={this.renderActions()}
        className="mr-panes-editor"
        disableDividers
        fullWidth
        hasCloseButton={!props.isValidator}
        isOpen
        maxWidth="md"
        onClose={props.onClose}
        title={this.renderTitle()}
      >
        <Box
          display="flex"
          flexDirection="row"
          style={
            {
              height: "100%",
              maxHeight: "100%",
              paddingTop: 8,
            }
          }
        >
          { this.renderNav() }

          <Box
            className="mr-pane-options"
            display="flex"
            flexDirection="column"
            flexGrow={1}
          >
            { this.renderStep() }
          </Box>
        </Box>
      </UiDialog>
    );
  }

}

PaneEditor.displayName = "PaneEditor";

PaneEditor.propTypes = {
  isEditor: PropTypes.bool.isRequired,
  isValidator: PropTypes.bool.isRequired,
  layoutModel: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  onEditPane: PropTypes.func.isRequired,
  onRemovePane: PropTypes.func.isRequired,
  paneId: PropTypes.string,
};

const PaneEditorDialog = React.memo(
  (props) => {
    const isOpen = props.isEditor || props.isValidator;

    if (isOpen) {
      return (<PaneEditor {...props} />);
    }
    else {
      return null;
    }
  }
);

PaneEditorDialog.displayName = "PaneEditorDialog";

export default PaneEditorDialog;
