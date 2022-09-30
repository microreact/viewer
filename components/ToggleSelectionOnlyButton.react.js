import { mdiFilter } from "@mdi/js";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import PropTypes from "prop-types";
import React from "react";

import UiSvgIcon from "./UiSvgIcon.react";
import UiControlsButton from "./UiControlsButton.react";

const ToggleSelectionOnlyButton = React.memo(
  (props) => (
    <UiControlsButton
      // active={props.active}
      className={props.className}
      onClick={() => props.onChange(!props.active)}
      title={props.active ? "Show filtered data" : "Show selected data"}
    >
      {
        props.active
          ?
          <CheckBoxRoundedIcon />
          :
          <UiSvgIcon fontSize="small" >{ mdiFilter }</UiSvgIcon>
      }
    </UiControlsButton>
  ),
);

ToggleSelectionOnlyButton.displayName = "ToggleSelectionOnlyButton";

ToggleSelectionOnlyButton.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default ToggleSelectionOnlyButton;
