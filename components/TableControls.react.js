import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import PropTypes from "prop-types";
import React from "react";

import UiAnimation from "./UiAnimation.react";
import UiControlsButton from "./UiControlsButton.react";
import UiControlsMenu from "./UiControlsMenu.react";
import UiDropdownMenu from "./UiDropdownMenu.react";
import UiRadioList from "./UiRadioList.react";
import MultipleDataColumnsSelect from "./MultipleDataColumnsSelect.react";

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
        {
          !props.isReadOnly && (
            <React.Fragment>
              <UiDropdownMenu.Item
                className="mr-edit-table-menu__item mr-edit-table"
                onClick={props.onEditPane}
              >
                Edit Table
              </UiDropdownMenu.Item>

              <Divider className="mr-edit-table-menu__item mr-divider" />
            </React.Fragment>
          )
        }

        <UiDropdownMenu.Item
          onClick={() => props.onHideUnselectedChange(!props.hideUnselected)}
        >
          { props.hideUnselected ? "Show" : "Hide" } unselected entries
        </UiDropdownMenu.Item>

        <UiDropdownMenu.Item
          className="mr-edit-table-menu__item mr-reset-columns"
          onClick={props.onResetColumns}
        >
          Reset column order
        </UiDropdownMenu.Item>

        <Divider className="mr-edit-table-menu__item mr-divider" />

        <UiDropdownMenu.Item
          className="mr-edit-table-menu__item mr-download-csv"
          onClick={props.onDownloadCsv}
        >
          Download as CSV
        </UiDropdownMenu.Item>

        {/* <UiDropdownMenu.Item
          onClick={props.onDownloadXSLX}
        >
          Download as XSLX
        </UiDropdownMenu.Item> */}
      </UiDropdownMenu>

      <UiControlsButton
        active={props.controls}
        onClick={() => props.onControlsChange(!props.controls)}
      />

      <UiAnimation in={props.controls}>

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
          <MultipleDataColumnsSelect
            dataColumns={props.dataFields}
            maxHeightOffset="216px"
            onChange={props.onVisibleFieldsChange}
            value={props.visibleFields}
          />
        </UiControlsMenu>
      </UiAnimation>
    </div>
  )
);

TableColumns.displayName = "TableColumns";

TableColumns.propTypes = {
  controls: PropTypes.bool.isRequired,
  dataFields: PropTypes.arrayOf(DataColumn).isRequired,
  displayMode: PropTypes.string.isRequired,
  hideUnselected: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  onControlsChange: PropTypes.func.isRequired,
  onDisplayModeChange: PropTypes.func.isRequired,
  onDownloadCsv: PropTypes.func.isRequired,
  onEditPane: PropTypes.func.isRequired,
  onHideUnselectedChange: PropTypes.func.isRequired,
  onResetColumns: PropTypes.func.isRequired,
  onShowSelecttionChange: PropTypes.func.isRequired,
  onVisibleFieldsChange: PropTypes.func.isRequired,
  showSelection: PropTypes.bool,
  visibleFields: PropTypes.arrayOf(PropTypes.string.isRequired),
};

export default TableColumns;
