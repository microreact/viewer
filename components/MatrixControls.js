import PropTypes from "prop-types";
import React from "react";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import CropFreeOutlinedIcon from "@mui/icons-material/CropFreeOutlined";

import { DataColumn, StylePalette } from "../utils/prop-types";

import DataColumnValuesCombobox from "../containers/DataColumnValuesCombobox.react";
import UiAnimation from "./UiAnimation.react";
import LassoButton from "./LassoButton.react";
import UiCombobox from "./UiCombobox.react";
import UiControlsButton from "./UiControlsButton.react";
import UiControlsMenu from "./UiControlsMenu.react";
import UiDropdownMenu from "./UiDropdownMenu.react";
import UiRadioList from "./UiRadioList.react";
import UiSelect from "./UiSelect.react";
import UiSlider from "./UiSlider.react";
import UiToggleButtons from "./UiToggleButtons.react";
import UiToggleSlider from "./UiToggleSlider.react";
import UiToggleSwitch from "./UiToggleSwitch.react";

const MatrixControls = React.memo(
  (props) => {
    return (
      <div
        className="mr-main-controls"
        data-html2canvas-ignore="true"
      >
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
                  Edit Map
                </UiDropdownMenu.Item>

                <Divider className="mr-edit-map-menu__item mr-divider" />
              </React.Fragment>
            )
          }

          <UiDropdownMenu.Item
            onClick={props.onDownloadPNG}
          >
            Download as PNG image
          </UiDropdownMenu.Item>
        </UiDropdownMenu>

        <UiControlsButton
          active={props.controls}
          onClick={() => props.onControlsChange(!props.controls)}
        />
      </div>
    );
  }
);

MatrixControls.displayName = "MatrixControls";

MatrixControls.propTypes = {
  isReadOnly: PropTypes.bool.isRequired,
  controls: PropTypes.bool.isRequired,
  onControlsChange: PropTypes.func.isRequired,
  onEditPane: PropTypes.func.isRequired,
};

export default MatrixControls;
