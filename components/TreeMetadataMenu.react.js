import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import { TreeType, DataColumn } from "../utils/prop-types";
import UiControlsMenu from "./UiControlsMenu.react";
import UiToggleSlider from "./UiToggleSlider.react";
import UiSelectList from "./UiSelectList.react";
import UiSlider from "./UiSlider.react";
import UiFloatingFilter from "./UiFloatingFilter.react";

const TreeMetadataMenu = React.memo(
  (props) => {
    return (
      <UiControlsMenu
        style={props.style}
        className={
          classnames(
            "mr-tree-metadata-menu",
            props.className,
          )
        }
        title="Metadata blocks"
      >
        <section>
          {
            (props.treeType === "rc" || props.treeType === "dg" || props.treeType === "hr") && (
              <UiToggleSlider
                label="Block Headers"
                onCheckedChange={props.onShowBlockHeadersChange}
                checked={props.showBlockHeaders}
                max={props.maxFontSize}
                min={props.minFontSize}
                onChange={props.onBlockHeaderFontSizeChange}
                unit="px"
                value={props.blockHeaderFontSize}
              />
            )
          }

          <UiSlider
            label="Block Length"
            max={props.maxBlockLength}
            min={props.minBlockLength}
            onChange={props.onBlockLengthChange}
            unit="px"
            value={props.blockLength}
          />

          <UiToggleSlider
            label="Block gap"
            onCheckedChange={(checked) => props.onBlockPaddingChange(checked ? 2 : 0)}
            checked={props.blockPadding > 0}
            max={props.maxBlockPadding}
            min={props.minBlockPadding}
            onChange={props.onBlockPaddingChange}
            unit="px"
            value={props.blockPadding}
          />

          {/* <UiSlider
            label="Block gap"
            max={props.maxBlockPadding}
            min={props.minBlockPadding}
            onChange={props.onBlockPaddingChange}
            unit="px"
            value={props.blockPadding}
          /> */}

        </section>

        <hr />

        <div
          // style={
          //   { margin: "0 -8px 0 8px" }
          // }
        >

        <UiFloatingFilter
          items={props.colourFields}
          label="Search columns"
        >
          {
            (items) => (
              <UiSelectList
                items={items}
                onChange={props.onBlocksChange}
                value={props.blocks}
                selectAll
                selectOnly
                style={
                  {
                    height: 40 + props.colourFields.length * 28,
                    maxHeight: "calc(100vh - 400px)",
                  }
                }
              />
            )
          }
        </UiFloatingFilter>

        </div>
      </UiControlsMenu>
    );
  }
);

TreeMetadataMenu.displayName = "TreeMetadataMenu";

TreeMetadataMenu.propTypes = {
  blockHeaderFontSize: PropTypes.number.isRequired,
  blockLength: PropTypes.number.isRequired,
  blockPadding: PropTypes.number.isRequired,
  blocks: PropTypes.arrayOf(PropTypes.string.isRequired),
  className: PropTypes.string,
  colourFields: PropTypes.arrayOf(DataColumn).isRequired,
  maxBlockLength: PropTypes.number.isRequired,
  maxBlockPadding: PropTypes.number.isRequired,
  maxFontSize: PropTypes.number.isRequired,
  minBlockLength: PropTypes.number.isRequired,
  minBlockPadding: PropTypes.number.isRequired,
  minFontSize: PropTypes.number.isRequired,
  onBlockHeaderFontSizeChange: PropTypes.func.isRequired,
  onBlockLengthChange: PropTypes.func.isRequired,
  onBlockPaddingChange: PropTypes.func.isRequired,
  onBlocksChange: PropTypes.func,
  onMetadataLabelsChange: PropTypes.func,
  onShowBlockHeadersChange: PropTypes.func,
  open: PropTypes.bool,
  showBlockHeaders: PropTypes.bool,
  showMetadataLabels: PropTypes.bool,
  toggle: PropTypes.func,
  treeType: TreeType.isRequired,
};

export default TreeMetadataMenu;
