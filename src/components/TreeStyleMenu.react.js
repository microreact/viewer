import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

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

        {
          (props.showShapes) && (
            <UiToggleSwitch
              label="Leaf Borders"
              onChange={props.onShowShapeBordersChange}
              value={props.showShapeBorders}
            />
          )
        }

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
        {
          (props.showLeafLabels) && (
            <UiToggleSwitch
              label="Align Leaf Labels"
              onChange={props.onAlignLabelsChange}
              value={props.alignLabels}
            />
          )
        }
        {
          (props.showLeafLabels) && (
            <UiToggleSwitch
              label="Colour Leaf Labels"
              onChange={props.onStyleLeafLabelsChange}
              value={props.styleLeafLabels}
            />
          )
        }

        <hr />

        <UiToggleSwitch
          label="Internal Nodes"
          onChange={props.onShowPiechartsChange}
          value={props.showPiecharts}
        />

        <hr />

        <UiToggleSlider
          checked={props.showInternalLabels}
          label="Internal Labels"
          max={props.maxFontSize}
          min={props.minFontSize}
          onChange={props.onInternalLabelsFontSizeChange}
          onCheckedChange={props.onShowInternalLabelsChange}
          unit="px"
          value={props.internalLabelsFontSize}
        />
        {
          (props.showInternalLabels) && (
            <UiToggleSwitch
              label="Filter Internal Nodes"
              onChange={props.onFilterInternalLabelsChange}
              value={props.filterInternalLabels}
            />
          )
        }
        {
          (props.filterInternalLabels) && (
            <Box
              alignItems="center"
              display="flex"
              flexDirection="row"
              style={{ margin: "8px 0" }}
            >
              <TextField
                label="Min value"
                onChange={(event) => props.onInternalLabelsFilterRangeChange(event.target.value, props.internalLabelsFilterRange[1])}
                size="small"
                style={{ width: "100%" }}
                type="number"
                value={props.internalLabelsFilterRange[0]}
                variant="outlined"
              />
              <TextField
                label="Max value"
                onChange={(event) => props.onInternalLabelsFilterRangeChange(props.internalLabelsFilterRange[0], event.target.value)}
                size="small"
                style={{ marginLeft: 8, width: "100%" }}
                type="number"
                value={props.internalLabelsFilterRange[1]}
                variant="outlined"
              />
            </Box>
          )
        }

        <hr />

        <UiToggleSlider
          checked={props.showBranchLengths}
          label="Branch Lengths"
          max={props.maxFontSize}
          min={props.minFontSize}
          onChange={props.onBranchLabelsFontSizeChange}
          onCheckedChange={props.onShowBranchLengthsChange}
          unit="px"
          value={props.branchLabelsFontSize}
        />
        {
          (props.showBranchLengths) && (
            <UiToggleSlider
              checked={props.roundBranchLengths}
              label="Rounding digits"
              max={16}
              min={0}
              onChange={props.onRoundBranchLengthsDigitsChange}
              onCheckedChange={props.onRoundBranchLengthsChange}
              unit=""
              value={props.branchLengthsDigits}
            />
          )
        }

        <hr />

        <UiToggleSwitch
          label="Colour Internal Edges"
          onChange={props.onStyleNodeEdgesChange}
          value={props.styleNodeEdges}
        />
        <UiToggleSwitch
          label="Solid Edges"
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
  branchLabelsFontSize: PropTypes.number,
  branchLengthsDigits: PropTypes.number.isRequired,
  className: PropTypes.string,
  filterInternalLabels: PropTypes.bool,
  fontSize: PropTypes.number.isRequired,
  internalLabelsFilterRange: PropTypes.array,
  internalLabelsFontSize: PropTypes.number,
  maxFontSize: PropTypes.number.isRequired,
  maxNodeSize: PropTypes.number.isRequired,
  minFontSize: PropTypes.number.isRequired,
  minNodeSize: PropTypes.number.isRequired,
  nodeSize: PropTypes.number.isRequired,
  onAlignLabelsChange: PropTypes.func.isRequired,
  onBranchLabelsFontSizeChange: PropTypes.func.isRequired,
  onFilterInternalLabelsChange: PropTypes.func.isRequired,
  onFontSizeChange: PropTypes.func.isRequired,
  onInternalLabelsFilterRangeChange: PropTypes.func.isRequired,
  onInternalLabelsFontSizeChange: PropTypes.func.isRequired,
  onNodeSizeChange: PropTypes.func.isRequired,
  onRoundBranchLengthsChange: PropTypes.func.isRequired,
  onRoundBranchLengthsDigitsChange: PropTypes.func.isRequired,
  onScaleLineAlphaChange: PropTypes.func.isRequired,
  onShowBranchLengthsChange: PropTypes.func.isRequired,
  onShowInternalLabelsChange: PropTypes.func.isRequired,
  onShowLeafLabelsChange: PropTypes.func.isRequired,
  onShowPiechartsChange: PropTypes.func.isRequired,
  onShowShapeBordersChange: PropTypes.func.isRequired,
  onShowShapesChange: PropTypes.func.isRequired,
  onStyleLeafLabelsChange: PropTypes.func.isRequired,
  onStyleNodeEdgesChange: PropTypes.func.isRequired,
  roundBranchLengths: PropTypes.bool.isRequired,
  scaleLineAlpha: PropTypes.bool.isRequired,
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
