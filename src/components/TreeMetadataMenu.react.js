import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import { TreeType, DataColumn } from "../utils/prop-types";
import UiControlsMenu from "./UiControlsMenu.react";
import UiToggleSlider from "./UiToggleSlider.react";
import UiSlider from "./UiSlider.react";
import MultipleDataColumnsSelect from "./MultipleDataColumnsSelect.react";

const TreeMetadataMenu = React.memo(
  (props) => {
    return (
      <UiControlsMenu
        className={
          classnames(
            "mr-tree-metadata-menu",
            props.className,
          )
        }
        style={props.style}
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
            label="Block Size"
            max={props.maxBlockSize}
            min={props.minBlockSize}
            onChange={props.onBlockSizeChange}
            unit="px"
            value={props.blockSize}
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

        <MultipleDataColumnsSelect
          dataColumns={props.colourFields}
          maxHeightOffset="400px"
          onChange={props.onBlocksChange}
          value={props.blocks}
        />

        </div>
      </UiControlsMenu>
    );
  }
);

TreeMetadataMenu.displayName = "TreeMetadataMenu";

TreeMetadataMenu.propTypes = {
  blockHeaderFontSize: PropTypes.number.isRequired,
  blockPadding: PropTypes.number.isRequired,
  blocks: PropTypes.arrayOf(PropTypes.string.isRequired),
  blockSize: PropTypes.number.isRequired,
  className: PropTypes.string,
  colourFields: PropTypes.arrayOf(DataColumn).isRequired,
  maxBlockPadding: PropTypes.number.isRequired,
  maxBlockSize: PropTypes.number.isRequired,
  maxFontSize: PropTypes.number.isRequired,
  minBlockPadding: PropTypes.number.isRequired,
  minBlockSize: PropTypes.number.isRequired,
  minFontSize: PropTypes.number.isRequired,
  onBlockHeaderFontSizeChange: PropTypes.func.isRequired,
  onBlockPaddingChange: PropTypes.func.isRequired,
  onBlocksChange: PropTypes.func,
  onBlockSizeChange: PropTypes.func.isRequired,
  onMetadataLabelsChange: PropTypes.func,
  onShowBlockHeadersChange: PropTypes.func,
  open: PropTypes.bool,
  showBlockHeaders: PropTypes.bool,
  showMetadataLabels: PropTypes.bool,
  style: PropTypes.object,
  toggle: PropTypes.func,
  treeType: TreeType.isRequired,
};

export default TreeMetadataMenu;
