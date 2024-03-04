import Divider from "@mui/material/Divider";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import React from "react";

// import "../styles/header-bar.css";
import { createNewTab } from "../utils/panes";
import PaneIcon from "./PaneIcon.react";
import UiDropdownMenu from "./UiDropdownMenu.react";
import UpdateFromMicroreact from "./UpdateFromMicroreact.js";

const AddPaneMenu = React.memo(
  (props) => {
    const [ showUpdateFromMicroreactFileDialog, setShowUpdateFromMicroreactFileDialog ] = React.useState(false);

    return (
      <React.Fragment>
        <UiDropdownMenu
          button={IconButton}
          buttonProps={
            {
              className: "mr-add-pane-menu-button",
              color: "inherit",
              size: "small",
              title: "Add or edit panels",
              children: (<EditTwoToneIcon />),
            }
          }
        >
          <UiDropdownMenu.Item
            className="mr-add-chart"
            onClick={() => createNewTab("Chart")}
          >
            <PaneIcon component="Chart" />
            &nbsp;
            Create new Chart
          </UiDropdownMenu.Item>

          <UiDropdownMenu.Item
            className="mr-add-data-slicer"
            onClick={() => createNewTab("Slicer")}
          >
            <PaneIcon component="Slicer" />
            &nbsp;
            Create new Data Slicer
          </UiDropdownMenu.Item>

          <UiDropdownMenu.Item
            className="mr-add-matrix"
            onClick={() => createNewTab("Matrix")}
          >
            <PaneIcon component="Matrix" />
            &nbsp;
            Create new Matrix
          </UiDropdownMenu.Item>

          <UiDropdownMenu.Item
            className="mr-add-map"
            onClick={() => createNewTab("Map")}
          >
            <PaneIcon component="Map" />
            &nbsp;
            Create new Map
          </UiDropdownMenu.Item>

          <UiDropdownMenu.Item
            className="mr-add-network"
            onClick={() => createNewTab("Network")}
          >
            <PaneIcon component="Network" />
            &nbsp;
            Create new Network
          </UiDropdownMenu.Item>

          <UiDropdownMenu.Item
            className="mr-add-note"
            onClick={() => createNewTab("Note")}
          >
            <PaneIcon component="Note" />
            &nbsp;
            Create new Note
          </UiDropdownMenu.Item>

          <UiDropdownMenu.Item
            className="mr-add-table"
            onClick={() => createNewTab("Table")}
          >
            <PaneIcon component="Table" />
            &nbsp;
            Create new Table
          </UiDropdownMenu.Item>

          <UiDropdownMenu.Item
            className="mr-add-timeline"
            onClick={() => createNewTab("Timeline")}
          >
            <PaneIcon component="Timeline" />
            &nbsp;
            Create new Timeline
          </UiDropdownMenu.Item>

          <UiDropdownMenu.Item
            className="mr-add-tree"
            onClick={() => createNewTab("Tree")}
          >
            <PaneIcon component="Tree" />
            &nbsp;
            Create new Tree
          </UiDropdownMenu.Item>

          {/*
          { props.panes.length > 0 && (<Divider />) }
          {
            props.panes.length > 0 && (
              <ListSubheader>
                Reopen Closed Panes
              </ListSubheader>
            )
          }

          {
            props.panes.map(
              (pane) => (
                <UiDropdownMenu.Item
                  key={pane}
                  onClick={() => reopenPaneTab(pane.id, pane.name, pane.component)}
                >
                  <PaneIcon component={pane.component} />
                  &nbsp;
                  { pane.name }
                </UiDropdownMenu.Item>

              )
            )
          }
          */}

          <Divider />

          <UiDropdownMenu.Item
            className="mr-edit-existing-panels"
            onClick={() => setShowUpdateFromMicroreactFileDialog(true)}
          >
            Update project
          </UiDropdownMenu.Item>

          <UiDropdownMenu.Item
            className="mr-edit-existing-panels"
            onClick={props.onEditPane}
          >
            Edit Existing Panels
          </UiDropdownMenu.Item>

        </UiDropdownMenu>
        {
          showUpdateFromMicroreactFileDialog && (
            <UpdateFromMicroreact
              onClose={() => setShowUpdateFromMicroreactFileDialog(false)}
            />
          )
        }
      </React.Fragment>
    );
  }
);

AddPaneMenu.displayName = "AddPaneMenu";

AddPaneMenu.propTypes = {
  onEditPane: PropTypes.func.isRequired,
};

export default AddPaneMenu;
