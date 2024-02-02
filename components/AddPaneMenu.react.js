import Divider from "@mui/material/Divider";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import React from "react";

// import "../styles/header-bar.css";
import { createNewTab } from "../utils/panes";
import PaneIcon from "./PaneIcon.react";
import UiDropdownMenu from "./UiDropdownMenu.react";

const AddPaneMenu = React.memo(
  (props) => {

    return (
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
          className="mr-add-pane-menu__item mr-add-chart"
          onClick={() => createNewTab("Chart")}
        >
          <PaneIcon component="Chart" />
          &nbsp;
          Create New Chart
        </UiDropdownMenu.Item>

        <UiDropdownMenu.Item
          className="mr-add-pane-menu__item mr-add-map"
          onClick={() => createNewTab("Map")}
        >
          <PaneIcon component="Map" />
          &nbsp;
          Create New Map
        </UiDropdownMenu.Item>

        <UiDropdownMenu.Item
          className="mr-add-pane-menu__item mr-add-network"
          onClick={() => createNewTab("Network")}
        >
          <PaneIcon component="Network" />
          &nbsp;
          Create New Network
        </UiDropdownMenu.Item>

        <UiDropdownMenu.Item
          className="mr-add-pane-menu__item mr-add-note"
          onClick={() => createNewTab("Note")}
        >
          <PaneIcon component="Note" />
          &nbsp;
          Create New Note
        </UiDropdownMenu.Item>

        <UiDropdownMenu.Item
          className="mr-add-pane-menu__item mr-add-table"
          onClick={() => createNewTab("Table")}
        >
          <PaneIcon component="Table" />
          &nbsp;
          Create New Table
        </UiDropdownMenu.Item>

        <UiDropdownMenu.Item
          className="mr-add-pane-menu__item mr-add-timeline"
          onClick={() => createNewTab("Timeline")}
        >
          <PaneIcon component="Timeline" />
          &nbsp;
          Create New Timeline
        </UiDropdownMenu.Item>

        <UiDropdownMenu.Item
          className="mr-add-pane-menu__item mr-add-tree"
          onClick={() => createNewTab("Tree")}
        >
          <PaneIcon component="Tree" />
          &nbsp;
          Create New Tree
        </UiDropdownMenu.Item>

        <Divider />

        &nbsp;&nbsp;Experimental

        <UiDropdownMenu.Item
          className="mr-add-pane-menu__item mr-add-data-slicer"
          onClick={() => createNewTab("Slicer")}
        >
          <PaneIcon component="Slicer" />
          &nbsp;
          Create New Data Slicer
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
          className="mr-add-pane-menu__item mr-edit-existing-panels mr-add-pane-menu__item mr-edit-panels"
          onClick={props.onEditPane}
        >
          <EditTwoToneIcon />
          &nbsp;
          Edit Existing Panels
        </UiDropdownMenu.Item>

      </UiDropdownMenu>
    );
  }
);

AddPaneMenu.displayName = "AddPaneMenu";

AddPaneMenu.propTypes = {
  onEditPane: PropTypes.func.isRequired,
};

export default AddPaneMenu;
