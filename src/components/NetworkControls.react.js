import PropTypes from "prop-types";
import React from "react";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";
import Slider from "@mui/material/Slider";
import MenuIcon from "@mui/icons-material/Menu";
import Divider from "@mui/material/Divider";

import UiAnimation from "./UiAnimation.react";
import UiControlsMenu from "./UiControlsMenu.react";
import LassoButton from "./LassoButton.react";
import UiControlsButton from "./UiControlsButton.react";
import UiToggleSwitch from "./UiToggleSwitch.react";
import UiFieldsList from "./UiFieldsList.react";
import UiDropdownMenu from "./UiDropdownMenu.react";

const NetworkControls = React.memo((props) => {
  return (
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
                Edit Network
              </UiDropdownMenu.Item>

              <Divider />
            </React.Fragment>
          )
        }

        <UiDropdownMenu.Item
          onClick={() => props.onDownloadDOT(props.networkFileId)}
        >
          Download as DOT
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

        <UiControlsButton
          onClick={() => props.onShuffleNodes()}
          title="Shuffle nodes"
        >
          <ShuffleRoundedIcon />
        </UiControlsButton>

        <UiControlsMenu
          className="mr-network-styles-menu"
          title="Nodes & Labels"
        >
          <label>
            Node Size: <strong>{props.nodeSize}</strong> pixels
          </label>
          <Slider
            max={props.maxNodeSize}
            min={props.minNodeSize}
            onChange={(event, value) => props.onNodeSizeChange(value)}
            value={props.nodeSize}
          />

          <label>
            Label Size: <strong>{props.labelSize}</strong> pixels
          </label>
          <Slider
            max={props.maxLabelSize}
            min={props.minLabelSize}
            onChange={(event, value) => props.onLabelSizeChange(value)}
            value={props.labelSize}
          />

          <hr />

          <UiToggleSwitch
            label="Show Nodes"
            onChange={props.onShowNodesChange}
            value={props.showNodes}
          />

          <UiToggleSwitch
            label="Show Labels"
            onChange={props.onShowLabelsChange}
            value={props.showLabels}
          />
        </UiControlsMenu>

        {
          (props.edgeColourAttributes?.length > 0) && (
            <UiControlsMenu
              fixedSize
              hideOnClick
              onClear={props.edgeColourFilter && (() => props.onEdgeFilterChange("edgeColourFilter"))}
              title="Edge Colours"
            >
              <UiFieldsList
                columns={props.edgeColourAttributes}
                onChange={(value) => props.onEdgeFilterChange("edgeColourFilter", value)}
                value={props.edgeColourFilter}
              />
            </UiControlsMenu>
          )
        }

        {
          (props.edgeLabelAttributes?.length > 0) && (
            <UiControlsMenu
              fixedSize
              hideOnClick
              onClear={props.edgeLabelFilter && (() => props.onEdgeFilterChange("edgeLabelFilter"))}
              title="Edge Labels"
            >
              <UiFieldsList
                columns={props.edgeLabelAttributes}
                onChange={(value) => props.onEdgeFilterChange("edgeLabelFilter", value)}
                value={props.edgeLabelFilter}
              />
            </UiControlsMenu>
          )
        }

        {
          (props.edgeLineStyleAttributes?.length > 0) && (
            <UiControlsMenu
              fixedSize
              hideOnClick
              onClear={props.edgeLineStyleFilter && (() => props.onEdgeFilterChange("edgeLineStyleFilter"))}
              title="Edge Style"
            >
              <UiFieldsList
                columns={props.edgeLineStyleAttributes}
                onChange={(value) => props.onEdgeFilterChange("edgeLineStyleFilter", value)}
                value={props.edgeLineStyleFilter}
              />
            </UiControlsMenu>
          )
        }

        {
          (props.edgeLineWidthAttributes?.length > 0) && (
            <UiControlsMenu
              fixedSize
              hideOnClick
              onClear={props.edgeLineWidthFilter && (() => props.onEdgeFilterChange("edgeLineWidthFilter"))}
              title="Edge Width"
            >
              <UiFieldsList
                columns={props.edgeLineWidthAttributes}
                onChange={(value) => props.onEdgeFilterChange("edgeLineWidthFilter", value)}
                value={props.edgeLineWidthFilter}
              />
            </UiControlsMenu>
          )
        }

        {/* <NetworkEdgeLabels
          networkId={props.networkId}
        />
        <NetworkEdgeColours
          networkId={props.networkId}
        />
        <NetworkEdgeLineWidths
          networkId={props.networkId}
        />
        <NetworkEdgeLineStyles
          networkId={props.networkId}
        /> */}
      </UiAnimation>
    </div>
  );
});

NetworkControls.displayName = "NetworkControls";

NetworkControls.propTypes = {
  controls: PropTypes.bool.isRequired,
  edgeColourAttributes: PropTypes.array.isRequired,
  edgeColourFilter: PropTypes.string,
  edgeLabelAttributes: PropTypes.array.isRequired,
  edgeLabelFilter: PropTypes.string,
  edgeLineStyleAttributes: PropTypes.array.isRequired,
  edgeLineStyleFilter: PropTypes.string,
  edgeLineWidthAttributes: PropTypes.array.isRequired,
  edgeLineWidthFilter: PropTypes.string,
  isReadOnly: PropTypes.bool.isRequired,
  labelSize: PropTypes.number.isRequired,
  lasso: PropTypes.bool.isRequired,
  maxLabelSize: PropTypes.number.isRequired,
  maxNodeSize: PropTypes.number.isRequired,
  minLabelSize: PropTypes.number.isRequired,
  minNodeSize: PropTypes.number.isRequired,
  networkId: PropTypes.string.isRequired,
  nodeSize: PropTypes.number.isRequired,
  onControlsChange: PropTypes.func.isRequired,
  onEdgeFilterChange: PropTypes.func.isRequired,
  onLabelSizeChange: PropTypes.func.isRequired,
  onLassoChange: PropTypes.func.isRequired,
  onNodeSizeChange: PropTypes.func.isRequired,
  onShowLabelsChange: PropTypes.func.isRequired,
  onShowNodesChange: PropTypes.func.isRequired,
  onShuffleNodes: PropTypes.func.isRequired,
  showLabels: PropTypes.bool.isRequired,
  showNodes: PropTypes.bool.isRequired,
};

export default NetworkControls;
