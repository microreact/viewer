import PropTypes from "prop-types";
import React from "react";
import MenuIcon from "@material-ui/icons/Menu";

import UiDropdownMenu from "./UiDropdownMenu.react";
import UiControlsButton from "./UiControlsButton.react";

const SlicerControls = React.memo(
  (props) => {
    return (
      <div className="mr-main-controls">
        <UiDropdownMenu
          button={UiControlsButton}
          icon={<MenuIcon />}
        >
          {
            !props.isReadOnly && (
              <UiDropdownMenu.Item
                onClick={props.onEditPane}
              >
                Edit Data Slicer
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
  isReadOnly: PropTypes.bool.isRequired,
  onEditPane: PropTypes.func.isRequired,
  slicerId: PropTypes.string.isRequired,
};

export default SlicerControls;
