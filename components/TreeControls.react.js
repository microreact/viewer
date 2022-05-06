import PropTypes from "prop-types";
import React from "react";
import MenuIcon from "@material-ui/icons/Menu";
import Divider from "@material-ui/core/Divider";

import { TreeType } from "../utils/prop-types";
import UiAnimation from "./UiAnimation.react";
import CircularTreeIcon from "./CircularTreeIcon.react";
import DiagonalTreeIcon from "./DiagonalTreeIcon.react";
import HierarchicalTreeIcon from "./HierarchicalTreeIcon.react";
import LassoButton from "./LassoButton.react";
import RadialTreeIcon from "./RadialTreeIcon.react";
import RectangularTreeIcon from "./RectangularTreeIcon.react";
import TreeMetadataMenu from "../containers/TreeMetadataMenu.react";
import TreeStyleMenu from "../containers/TreeStyleMenu.react";
import UiSpeedDial from "./UiSpeedDial.react";
import UiDropdownMenu from "./UiDropdownMenu.react";
import UiControlsButton from "./UiControlsButton.react";

const treeTypes = [
  {
    value: "rc",
    label: "Rectangular Tree",
    icon: (<RectangularTreeIcon />),
  },
  {
    value: "cr",
    label: "Circular Tree",
    icon: (<CircularTreeIcon />),
  },
  {
    value: "rd",
    label: "Radial Tree",
    icon: (<RadialTreeIcon />),
  },
  {
    value: "dg",
    label: "Diagonal Tree",
    icon: (<DiagonalTreeIcon />),
  },
  {
    value: "hr",
    label: "Hierarchical Tree",
    icon: (<HierarchicalTreeIcon />),
  },
];

const TreeControls = React.memo(
  (props) => (
    <div className="mr-main-controls">
      <UiDropdownMenu
        button={UiControlsButton}
        icon={<MenuIcon />}
      >
        {
          !props.isReadOnly && (
            <React.Fragment>
              <UiDropdownMenu.Item
                onClick={props.onEditPane}
              >
                Edit Tree
              </UiDropdownMenu.Item>

              <Divider />
            </React.Fragment>
          )
        }

        <UiDropdownMenu.Item
          onClick={props.onDownloadNewick}
        >
          Download as Newick
        </UiDropdownMenu.Item>
        <UiDropdownMenu.Item
          onClick={props.onDownloadPNG}
        >
          Download as PNG image
        </UiDropdownMenu.Item>
        <UiDropdownMenu.Item
          onClick={props.onDownloadSVG}
        >
          Download as SVG image
        </UiDropdownMenu.Item>
      </UiDropdownMenu>

      <UiControlsButton
        active={props.controls}
        onClick={() => props.onControlsChange(!props.controls)}
      />

      <UiAnimation in={props.controls}>

        <LassoButton
          active={props.lasso}
          onClick={() => props.onLassoChange(!props.lasso)}
        />

        <hr />

        <UiSpeedDial
          items={treeTypes}
          label="Tree Type"
          value={props.type}
          onChange={props.onTypeChange}
        />

        {/*
        <ControlsButton
          active={props.type === "hr"}
          onClick={() => props.onTypeChange("hr")}
          title="Hierarchical Tree"
        >
          <HierarchicalTreeIcon />
        </ControlsButton>
        <ControlsButton
          active={props.type === "dg"}
          onClick={() => props.onTypeChange("dg")}
          title="Diagonal Tree"
        >
          <DiagonalTreeIcon />
        </ControlsButton>
        <ControlsButton
          active={props.type === "rd"}
          onClick={() => props.onTypeChange("rd")}
          title="Radial Tree"
        >
          <RadialTreeIcon />
        </ControlsButton>

        <ControlsButton
          active={props.type === "cr"}
          onClick={() => props.onTypeChange("cr")}
          title="Circular Tree"
        >
          <CircularTreeIcon />
        </ControlsButton>
        <ControlsButton
          active={props.type === "rc"}
          onClick={() => props.onTypeChange("rc")}
          title="Rectangular Tree"
        >
          <RectangularTreeIcon />
        </ControlsButton>
        */}

        <hr />

        <TreeMetadataMenu
          treeId={props.treeId}
        />

        <TreeStyleMenu
          treeId={props.treeId}
        />

      </UiAnimation>
    </div>
  ),
);

TreeControls.displayName = "TreeControls";

TreeControls.propTypes = {
  controls: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  lasso: PropTypes.bool.isRequired,
  onControlsChange: PropTypes.func.isRequired,
  onDownloadNewick: PropTypes.func.isRequired,
  onDownloadPNG: PropTypes.func.isRequired,
  onDownloadSVG: PropTypes.func.isRequired,
  onEditPane: PropTypes.func.isRequired,
  onLassoChange: PropTypes.func.isRequired,
  onTypeChange: PropTypes.func.isRequired,
  treeId: PropTypes.string.isRequired,
  type: TreeType.isRequired,
};

export default TreeControls;
