import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import UiControlsMenu from "./UiControlsMenu.react";
import UiToggleSwitch from "./UiToggleSwitch.react";
import UiToggleSlider from "./UiToggleSlider.react";

const TreeStylesMenu = React.memo(
  (props) => {
    return (
      <UiControlsMenu
        className={
          classnames(
            "mr-tree-styles-menu",
            props.className,
          )
        }
        style={props.style}
        title="Nodes & Labels"
      >
        <UiToggleSlider
          checked={props.showShapes}
          label="Leaf Nodes"
          max={props.maxNodeSize}
          min={props.minNodeSize}
          onChange={props.onNodeSizeChange}
          onCheckedChange={props.onShowShapesChange}
          unit="px"
          value={props.nodeSize}
        />
        <UiToggleSwitch
          label="Leaf Borders"
          onChange={props.onShowShapeBordersChange}
          value={props.showShapeBorders}
        />

        <hr />

        <UiToggleSlider
          checked={props.showLeafLabels}
          label="Leaf Labels"
          max={props.maxFontSize}
          min={props.minFontSize}
          onChange={props.onFontSizeChange}
          onCheckedChange={props.onShowLeafLabelsChange}
          unit="px"
          value={props.fontSize}
        />
        <UiToggleSwitch
          label="Align Leaf Labels"
          onChange={props.onAlignLabelsChange}
          value={props.alignLabels}
        />
        <UiToggleSwitch
          label="Colour Leaf Labels"
          onChange={props.onStyleLeafLabelsChange}
          value={props.styleLeafLabels}
        />

        <hr />
        <UiToggleSwitch
          label="Show Internal Nodes"
          onChange={props.onShowPiechartsChange}
          value={props.showPiecharts}
        />
        <UiToggleSwitch
          label="Show Internal Labels"
          onChange={props.onShowInternalLabelsChange}
          value={props.showInternalLabels}
        />
        <UiToggleSwitch
          label="Show Branch Lengths"
          onChange={props.onShowBranchLengthsChange}
          value={props.showBranchLengths}
        />
        <UiToggleSwitch
          label="Colour Internal Edges"
          onChange={props.onStyleNodeEdgesChange}
          value={props.styleNodeEdges}
        />
        <UiToggleSwitch
          label="Opaque Edges"
          onChange={(value) => props.onScaleLineAlphaChange(!value)}
          value={!props.scaleLineAlpha}
        />
      </UiControlsMenu>
    );
  }
);

TreeStylesMenu.displayName = "TreeStylesMenu";

TreeStylesMenu.propTypes = {
  alignLabels: PropTypes.bool.isRequired,
  className: PropTypes.string,
  fontSize: PropTypes.number.isRequired,
  maxFontSize: PropTypes.number.isRequired,
  maxNodeSize: PropTypes.number.isRequired,
  minFontSize: PropTypes.number.isRequired,
  minNodeSize: PropTypes.number.isRequired,
  nodeSize: PropTypes.number.isRequired,
  onAlignLabelsChange: PropTypes.func.isRequired,
  onFontSizeChange: PropTypes.func.isRequired,
  onNodeSizeChange: PropTypes.func.isRequired,
  onShowBranchLengthsChange: PropTypes.func.isRequired,
  onShowInternalLabelsChange: PropTypes.func.isRequired,
  onShowLeafLabelsChange: PropTypes.func.isRequired,
  onShowPiechartsChange: PropTypes.func.isRequired,
  onShowShapeBordersChange: PropTypes.func.isRequired,
  onShowShapesChange: PropTypes.func.isRequired,
  onStyleLeafLabelsChange: PropTypes.func.isRequired,
  onStyleNodeEdgesChange: PropTypes.func.isRequired,
  showBranchLengths: PropTypes.bool.isRequired,
  showInternalLabels: PropTypes.bool.isRequired,
  showLeafLabels: PropTypes.bool.isRequired,
  showPiecharts: PropTypes.bool.isRequired,
  showShapeBorders: PropTypes.bool.isRequired,
  showShapes: PropTypes.bool.isRequired,
  style: PropTypes.object,
  styleLeafLabels: PropTypes.bool.isRequired,
  styleNodeEdges: PropTypes.bool.isRequired,
};

export default TreeStylesMenu;
