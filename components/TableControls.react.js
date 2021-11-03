import Divider from "@material-ui/core/Divider";
import MenuIcon from "@material-ui/icons/Menu";
import PropTypes from "prop-types";
import React from "react";

import Animation from "./Animation.react";
import UiControlsButton from "./UiControlsButton.react";
import UiControlsMenu from "./UiControlsMenu.react";
import UiDropdownMenu from "./UiDropdownMenu.react";
import UiFloatingFilter from "./UiFloatingFilter.react";
import UiRadioList from "./UiRadioList.react";
import UiSelectList from "./UiSelectList.react";

import { DataColumn } from "../utils/prop-types";
// import ToggleSelectionOnlyButton from "./ToggleSelectionOnlyButton.react";

const displayModes = [
  { value: "comfortable", label: "Comfortable" },
  { value: "cosy", label: "Cosy" },
  { value: "compact", label: "Compact" },
];

const TableColumns = React.memo(
  (props) => (
    <div className="mr-main-controls">
      <UiDropdownMenu
        button={UiControlsButton}
        icon={<MenuIcon />}
      >
        <UiDropdownMenu.Item
          onClick={props.onEditPane}
        >
          Edit Table
        </UiDropdownMenu.Item>

        <Divider />

        <UiDropdownMenu.Item
          onClick={props.onDownloadCsv}
        >
          Download as CSV
        </UiDropdownMenu.Item>
        {/* <UiDropdownMenu.Item
          onClick={props.onDownloadPNG}
        >
          Download as XSLX
        </UiDropdownMenu.Item> */}
      </UiDropdownMenu>

      <UiControlsButton
        active={props.controls}
        onClick={() => props.onControlsChange(!props.controls)}
      />

      <Animation in={props.controls}>

        {/* <ToggleSelectionOnlyButton
          active={props.showSelection}
          onChange={props.onShowSelecttionChange}
        /> */}

        <UiControlsMenu
          title="Display density"
          summary="Density"
          hideOnClick
        >
          <UiRadioList
            items={displayModes}
            onChange={props.onDisplayModeChange}
            value={props.displayMode}
          />
        </UiControlsMenu>

        <UiControlsMenu
          title="Columns"
        >
          <UiFloatingFilter
            items={props.dataFields}
            label="Search columns"
          >
            {
              (items) => (
                <UiSelectList
                  items={items}
                  onChange={props.onVisibleFieldsChange}
                  value={props.visibleFields}
                  selectAll
                  style={
                    {
                      height: 40 + props.dataFields.length * 28,
                      maxHeight: "calc(100vh - 216px)",
                    }
                  }
                />
              )
            }
          </UiFloatingFilter>
        </UiControlsMenu>
      </Animation>
    </div>
  )
);

TableColumns.displayName = "TableColumns";

TableColumns.propTypes = {
  controls: PropTypes.bool.isRequired,
  dataFields: PropTypes.arrayOf(DataColumn).isRequired,
  visibleFields: PropTypes.arrayOf(PropTypes.string.isRequired),
  displayMode: PropTypes.string.isRequired,
  onControlsChange: PropTypes.func.isRequired,
  onEditPane: PropTypes.func.isRequired,
  onVisibleFieldsChange: PropTypes.func.isRequired,
  onDisplayModeChange: PropTypes.func.isRequired,
  onShowSelecttionChange: PropTypes.func.isRequired,
  showSelection: PropTypes.bool,
};

export default TableColumns;
