import PropTypes from "prop-types";
import React from "react";
import MenuIcon from "@material-ui/icons/Menu";
import Divider from "@material-ui/core/Divider";

import UiDropdownMenu from "./UiDropdownMenu.react";
import UiControlsButton from "./UiControlsButton.react";

const SlicerControls = React.memo(
  (props) => {
    const isChart = (props.slicerType === "chart");
    return (
      <div className="mr-main-controls">
        <UiDropdownMenu
          button={UiControlsButton}
          icon={<MenuIcon />}
        >
          <UiDropdownMenu.Item
            onClick={props.onEditPane}
          >
            Edit Data Slicer
          </UiDropdownMenu.Item>

          {
            isChart && (<Divider />)
          }

          {
            isChart && (
              <UiDropdownMenu.Item
                onClick={props.onDownloadPNG}
              >
                Download as PNG image
              </UiDropdownMenu.Item>
            )
          }

          {
            isChart && (
                <UiDropdownMenu.Item
                onClick={props.onDownloadSVG}
              >
                Download as SVG image
              </UiDropdownMenu.Item>
            )
          }
        </UiDropdownMenu>

      </div>
    );
  }
);

SlicerControls.displayName = "SlicerControls";

SlicerControls.propTypes = {
  onDownloadPNG: PropTypes.func.isRequired,
  onDownloadSVG: PropTypes.func.isRequired,
  onEditPane: PropTypes.func.isRequired,
  slicerId: PropTypes.string.isRequired,
  slicerType: PropTypes.string.isRequired,
};

export default SlicerControls;
